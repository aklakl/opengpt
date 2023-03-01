export class WarmupInitialDto {
  /**
   * schedule id
   */
  scheduleId: string;
  /**
   * the audience size
   */
  audienceSize: number;
  /**
   * send count in a day after warmup-ed
   * default equals audiences count
   */
  audienceCountPerDay?: number;
  /**
   * the first day to warmup
   * YYYY-MM-DD
   */
  startDate?: string;
  /**
   * the audience count of first day
   */
  initialCount?: number;
}
