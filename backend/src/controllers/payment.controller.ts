import { Request, Response } from 'express';
import crypto from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import Payment from '../models/payment.model';
import User from '../models/user.model';
import fetch from 'node-fetch';

export const initiateEsewaPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { plan, amount } = req.body as { plan: string; amount: number };
    const userId = req.user!._id;

    if (!plan || !amount) {
      res.status(400).json({ success: false, message: 'Plan and amount are required.' });
      return;
    }

    const transaction_uuid = uuidv4();
    const newPayment = new Payment({ userId, plan, amount, transaction_uuid, status: 'pending' });
    await newPayment.save();

    const secretKey = process.env.ESEWA_SECRET_KEY!;
    const total_amount = amount.toString();
    const product_code = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';
    
    // Create message in exact order eSEWA expects
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const signature = crypto.HmacSHA256(message, secretKey).toString(crypto.enc.Base64);

    const esewaData = {
      total_amount,
      transaction_uuid,
      product_code,
      signature,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      amount: total_amount,
      failure_url: `${process.env.BASE_URL}/payment/failure`,
      product_delivery_charge: '0',
      product_service_charge: '0',
      success_url: `${process.env.API_URL}/payment/verify`,
      tax_amount: '0',
    };

    res.status(200).json({ success: true, message: 'eSewa payment initiated', data: esewaData });
  } catch (error) {
    console.error('eSewa initiation error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const verifyEsewaPayment = async (req: Request, res: Response): Promise<void> => {
  const successRedirectUrl = `${process.env.BASE_URL}/payment/success?status=success`;
  const failureRedirectUrl = `${process.env.BASE_URL}/payment/failure?status=failure`;

  try {
    const { data } = req.query as { data?: string };
    if (!data) {
      console.log('No data received in verify endpoint');
      res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('No data received.')}`);
      return;
    }

    let decodedData;
    try {
      decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
      console.log('Decoded eSEWA data:', { 
        transaction_uuid: decodedData.transaction_uuid, 
        total_amount: decodedData.total_amount 
      });
    } catch (parseError) {
      console.error('Failed to decode eSEWA data:', parseError);
      res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('Invalid data format.')}`);
      return;
    }

    const product_code = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';
    const verificationUrl = `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`;

    console.log('Verifying with eSEWA:', verificationUrl);
    const response = await fetch(verificationUrl);
    
    if (!response.ok) {
      console.error(`eSewa verification failed. Status: ${response.status}`);
      throw new Error(`eSewa verification check failed. Status: ${response.status}`);
    }

    const verificationResponse = (await response.json()) as { status: string; transaction_uuid: string };
    console.log('eSEWA verification response:', verificationResponse);

    if (verificationResponse.status.toUpperCase() === 'COMPLETE') {
      const payment = await Payment.findOne({ transaction_uuid: verificationResponse.transaction_uuid });
      if (!payment) {
        console.error('Payment record not found:', verificationResponse.transaction_uuid);
        res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('Payment record not found.')}`);
        return;
      }
      if (payment.status === 'success') {
        console.log('Payment already processed:', payment._id);
        res.redirect(successRedirectUrl);
        return;
      }

      payment.status = 'success';
      await payment.save();
      console.log('Payment marked as success:', payment._id);

      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      const updatedUser = await User.findByIdAndUpdate(
        payment.userId,
        {
          subscription: payment.plan,
          subscriptionExpiresAt: expirationDate,
        },
        { new: true }
      );

      if (!updatedUser) {
        console.error('Failed to update user:', payment.userId);
        res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('Account update failed.')}`);
        return;
      }

      console.log('User subscription updated:', { userId: payment.userId, plan: payment.plan, expiresAt: expirationDate });
      res.redirect(successRedirectUrl);
    } else {
      console.log('Payment not complete:', { status: verificationResponse.status, uuid: decodedData.transaction_uuid });
      await Payment.findOneAndUpdate({ transaction_uuid: decodedData.transaction_uuid }, { status: 'failure' });
      res.redirect(
        `${failureRedirectUrl}&message=${encodeURIComponent(`Transaction status is ${verificationResponse.status}.`)}`
      );
    }
  } catch (error) {
    console.error('--- FATAL ERROR in verifyEsewaPayment ---', error);
    res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('An internal server error occurred.')}`);
  }
};

export const getTransactionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const payments = await Payment.find({ userId, status: 'success' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getAllTransactionHistory = async (_req: Request, res: Response): Promise<void> => {
  try {
    const allTransactions = await Payment.find({}).populate('userId', 'name email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: allTransactions,
    });
  } catch (error) {
    console.error('Get transaction history error ', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
// TODO: handle duplicate payment webhook events
