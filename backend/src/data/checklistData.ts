export interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}

export interface ChecklistAddon {
  category: string;
  item: ChecklistItem;
}

export interface ChecklistBase {
  essentials: ChecklistItem[];
  clothing: ChecklistItem[];
  gear: ChecklistItem[];
  [key: string]: ChecklistItem[];
}

export interface ChecklistData {
  base: ChecklistBase;
  experience: Record<string, ChecklistAddon[]>;
  duration: Record<string, ChecklistAddon[]>;
  weather: Record<string, ChecklistAddon[]>;
}

const checklistData: ChecklistData = {
  base: {
    essentials: [
      { id: 1, text: 'Water Bottle(s)', checked: false },
      { id: 2, text: 'First-Aid Kit', checked: false },
      { id: 3, text: 'Snacks/Energy Bars', checked: false },
      { id: 4, text: 'Trail Map', checked: false },
      { id: 5, text: 'Flashlight/Headlamp', checked: false },
    ],
    clothing: [
      { id: 6, text: 'Trekking Boots/Shoes', checked: false },
      { id: 7, text: 'Extra Layers', checked: false },
    ],
    gear: [
      { id: 8, text: 'Trekking Backpack', checked: false },
      { id: 9, text: 'Sunscreen', checked: false },
    ],
  },
  experience: {
    beginner: [
      { category: 'essentials', item: { id: 10, text: 'Printed Directions', checked: false } },
      { category: 'essentials', item: { id: 19, text: 'Emergency Contact List', checked: false } },
      { category: 'gear', item: { id: 20, text: 'Whistle', checked: false } },
    ],
    intermediate: [
      { category: 'gear', item: { id: 11, text: 'GPS Device/App', checked: false } },
      { category: 'gear', item: { id: 21, text: 'Compass', checked: false } },
    ],
    advanced: [
      { category: 'gear', item: { id: 11, text: 'GPS Device/App', checked: false } },
      { category: 'gear', item: { id: 22, text: 'Satellite Communicator', checked: false } },
      { category: 'gear', item: { id: 23, text: 'Climbing Rope', checked: false } },
    ],
  },
  duration: {
    day: [
      { category: 'essentials', item: { id: 24, text: 'Light Snacks', checked: false } },
    ],
    overnight: [
      { category: 'essentials', item: { id: 12, text: 'Packed Lunch', checked: false } },
      { category: 'gear', item: { id: 13, text: 'Tent & Sleeping Bag', checked: false } },
      { category: 'essentials', item: { id: 25, text: 'Dinner Food', checked: false } },
    ],
    'multi-day': [
      { category: 'essentials', item: { id: 12, text: 'Packed Lunch', checked: false } },
      { category: 'gear', item: { id: 13, text: 'Tent & Sleeping Bag', checked: false } },
      { category: 'gear', item: { id: 14, text: 'Cooking Gear', checked: false } },
      { category: 'essentials', item: { id: 26, text: 'Multiple Days Food Supply', checked: false } },
      { category: 'gear', item: { id: 27, text: 'Water Purification Tablets', checked: false } },
    ],
  },
  weather: {
    sunny: [
      { category: 'clothing', item: { id: 15, text: 'Hat/Cap for Sun Protection', checked: false } },
      { category: 'gear', item: { id: 28, text: 'Sunglasses', checked: false } },
      { category: 'gear', item: { id: 29, text: 'Extra Sunscreen', checked: false } },
    ],
    hot: [
      { category: 'clothing', item: { id: 15, text: 'Hat/Cap for Sun Protection', checked: false } },
      { category: 'clothing', item: { id: 30, text: 'Light, Breathable Clothing', checked: false } },
      { category: 'essentials', item: { id: 31, text: 'Electrolyte Drinks', checked: false } },
    ],
    cold: [
      { category: 'clothing', item: { id: 16, text: 'Winter Hat & Gloves', checked: false } },
      { category: 'clothing', item: { id: 32, text: 'Thermal Underwear', checked: false } },
      { category: 'clothing', item: { id: 33, text: 'Insulated Jacket', checked: false } },
    ],
    rainy: [
      { category: 'clothing', item: { id: 17, text: 'Rain Gear/Poncho', checked: false } },
      { category: 'gear', item: { id: 18, text: 'Waterproof Pack Cover', checked: false } },
      { category: 'gear', item: { id: 34, text: 'Dry Bags', checked: false } },
    ],
  },
};

export default checklistData;
// TODO: externalize checklist data to config file
