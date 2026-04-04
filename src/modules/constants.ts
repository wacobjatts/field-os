/**
 * Application-level constants
 *
 * Purpose:
 * - hold environment-safe app constants
 * - keep configuration out of core
 * - provide one clean import surface for non-engine modules
 */

export const APP_NAME = 'FieldOS';

export const APP_VERSION = '0.1.0';

export const DEFAULT_TIMEZONE = 'UTC';

export const DEFAULT_SYMBOL = 'BTCUSDT';

export const DEFAULT_LOOP_INTERVAL_MS = 100;

export const DEFAULT_HISTORY_LIMIT = 1000;

export const DATA_DIRECTORY = 'data';

export const RAW_LIVE_DATA_FILE = `${DATA_DIRECTORY}/binance-btcusdt-raw.jsonl`;

export const BLACKHOLE_RECORD_FILE = `${DATA_DIRECTORY}/kinetic-blackhole.jsonl`;

export const BLACKHOLE_LOOP_RECORD_FILE = `${DATA_DIRECTORY}/kinetic-blackhole-loop.jsonl`;

export const BINANCE_WS_BASE_URL = 'wss://stream.binance.com:9443';

export const BINANCE_BTCUSDT_COMBINED_STREAM =
  `${BINANCE_WS_BASE_URL}/stream?streams=btcusdt@aggTrade/btcusdt@depth@100ms`;

export const MIN_BRANCH_PRECISION = 1e-12;

export const MAX_HISTORY_ENTRIES = 1000;