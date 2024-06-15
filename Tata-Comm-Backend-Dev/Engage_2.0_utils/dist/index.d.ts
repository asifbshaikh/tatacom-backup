/**
 * @name Get contrasting text color
 * @description Get contrasting text color from a text color
 * @param bgColor  Background color of text.
 * @returns contrasting text color
 */
export declare const getContrastingTextColor: (bgColor: string) => string;
/**
 * @name Get formatted date
 * @description Get date in today, yesterday or any other date format
 * @param date  date
 * @param todayText  Today text
 * @param yesterdayText  Yesterday text
 * @returns formatted date
 */
export declare const formatDate: ({ date, todayText, yesterdayText, }: {
    date: string;
    todayText: string;
    yesterdayText: string;
}) => string;
/**
 * @name formatTime
 * @description Format time to Hour, Minute and Second
 * @param timeInSeconds  number
 * @returns formatted time
 */
export declare const formatTime: (timeInSeconds: number) => string;
