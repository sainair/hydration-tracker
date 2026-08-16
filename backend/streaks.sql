WITH qualifying_days AS (
    SELECT (e.logged_at AT TIME ZONE :tz)::date AS local_day,
           SUM(e.amount) AS day_total
    FROM entry e
    JOIN habits h ON h.id = e.habit_id
    WHERE e.habit_id = :habit_id
      AND h.user_id  = :user_id
    GROUP BY local_day, h.target
    HAVING SUM(e.amount) >= h.target
),
numbered AS (
    SELECT local_day,
           ROW_NUMBER() OVER (ORDER BY local_day) AS rn
    FROM qualifying_days
),
streaks AS (
    SELECT COUNT(*)       AS streak_length,
           MIN(local_day) AS started,
           MAX(local_day) AS ended
    FROM numbered
    GROUP BY local_day - rn::int
)
SELECT
    CASE
        WHEN ended >= (now() AT TIME ZONE :tz)::date - 1
        THEN streak_length
        ELSE 0
    END            AS current_streak,
    streak_length  AS last_run_length,
    started,
    ended
FROM streaks
ORDER BY ended DESC
LIMIT 1;