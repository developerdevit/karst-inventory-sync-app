export async function getRedisDbReadableInfo(redisClient) {
  try {
    const info = await redisClient.info();
    console.log(`Redis Database info: ${info}`);

    return info;
  } catch (error) {
    console.error('Error getting Redis database info:', error);
  }
}

// connected_clients:
// used_memory_human:
// used_memory_rss_human:
// used_memory_peak_human:
// total_system_memory_human:

// total_connections_received:
// total_commands_processed:

// # Keyspace
// db0:
// db1:
