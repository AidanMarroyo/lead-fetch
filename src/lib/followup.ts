// lib/followup.ts
export function getNextFollowUpDate(
    lastContactDate: string,
    contactAttempts: number
  ): string {
    const baseDate = new Date(lastContactDate);
    let daysToAdd = 2; // default for first attempt
  
    if (contactAttempts === 1) daysToAdd = 0;
    else if (contactAttempts === 2) daysToAdd = 4;
    else if (contactAttempts === 3) daysToAdd = 7;
    else if (contactAttempts === 4) daysToAdd = 14;
    else if (contactAttempts >= 5) daysToAdd = 30;
  
    baseDate.setDate(baseDate.getDate() + daysToAdd);
  
    return baseDate.toISOString();
  }
  