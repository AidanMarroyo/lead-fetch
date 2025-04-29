// lib/followup.ts
export function getNextFollowUpDate(contactAttempts: number): string {
    const baseDate = new Date(); // Always use now
    let daysToAdd = 0;
  
    switch (contactAttempts) {
      case 1:
        daysToAdd = 1;
        break;
      case 2:
        daysToAdd = 2;
        break;
      case 3:
        daysToAdd = 4;
        break;
      case 4:
        daysToAdd = 7;
        break;
      case 5:
        daysToAdd = 14;
        break;
      default:
        daysToAdd = 21;
        break;
    }
  
    baseDate.setDate(baseDate.getDate() + daysToAdd);
    return baseDate.toISOString().split('T')[0];
  }
  