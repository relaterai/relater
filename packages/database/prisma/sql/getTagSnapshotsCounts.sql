SELECT 
    unnest(t.path_segments) as path_segment,
    COUNT(DISTINCT s.id)::integer as snapshot_count
FROM tags t
LEFT JOIN "_SnapshotToTag" st ON t.id = st."B"
LEFT JOIN snapshots s ON st."A" = s.id AND s.is_deleted = false
WHERE t.is_deleted = false 
  AND t.user_id = $1
GROUP BY path_segment
ORDER BY path_segment;