'use client';
import { useState, FormEvent } from 'react';
import { z } from 'zod';

export function useForm<T extends Record<string, any>>(schema: z.ZodSchema, initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    try { schema.parse(values); setErrors({}); return true; }
    catch (err: any) {
      const fieldErrors: Record<string, string> = {};
      if (err.issues) err.issues.forEach((issue: any) => { const path = issue.path?.[0]; if (path) fieldErrors[path] = issue.message; });
      else if (err.errors) err.errors.forEach((issue: any) => { const path = issue.path?.[0]; if (path) fieldErrors[path] = issue.message; });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = (onSubmit: (data: T) => void) => (e: FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(values);
  };

  const reset = () => { setValues(initialValues); setErrors({}); };
  return { values, errors, handleChange, handleSubmit, validate, reset, setValues, setErrors };
}
