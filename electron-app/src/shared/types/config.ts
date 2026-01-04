import { z } from 'zod';

// Camera configuration schema
export const CameraConfigSchema = z.object({
  ffmpeg: z.object({
    inputs: z.array(z.object({
      path: z.string(),
      roles: z.array(z.enum(['detect', 'record', 'audio'])),
      global_args: z.string().optional(),
      input_args: z.string().optional()
    }))
  }),
  detect: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    fps: z.number().optional()
  }).optional(),
  motion: z.object({
    mask: z.union([z.string(), z.array(z.string())]).optional()
  }).optional(),
  zones: z.record(z.object({
    coordinates: z.string(),
    objects: z.array(z.string()).optional(),
    inertia: z.number().int().nonnegative().optional(),
    loitering_time: z.number().nonnegative().optional()
  })).optional(),
  record: z.object({
    enabled: z.boolean().default(false),
    retain: z.object({
      days: z.number().int().nonnegative().default(0),
      mode: z.enum(['all', 'motion', 'active_objects']).default('all')
    }).optional(),
    events: z.object({
      pre_capture: z.number().int().nonnegative().default(5),
      post_capture: z.number().int().nonnegative().default(5),
      required_zones: z.array(z.string()).optional(),
      objects: z.array(z.string()).optional()
    }).optional()
  }).optional(),
  objects: z.object({
    track: z.array(z.string())
  }).optional(),
  snapshots: z.object({
    enabled: z.boolean(),
    timestamp: z.boolean().optional(),
    bounding_box: z.boolean().optional(),
    quality: z.number().int().min(1).max(100).optional()
  }).optional()
});

// MQTT configuration schema
export const MQTTConfigSchema = z.object({
  host: z.string(),
  port: z.number().optional(),
  user: z.string().optional(),
  password: z.string().optional(),
  topic_prefix: z.string().optional(),
  client_id: z.string().optional()
});

// Audio configuration schema
export const AudioConfigSchema = z.object({
  enabled: z.boolean(),
  device: z.string().optional(),
  threshold: z.number().optional(),
  duration: z.number().optional()
});

// Detectors (global)
export const DetectorsSchema = z.record(z.object({
  type: z.string(),
  device: z.string().optional()
}));
export type Detectors = z.infer<typeof DetectorsSchema>;

// go2rtc streams (global)
export const Go2RTCSchema = z.object({
  streams: z.record(z.string())
});
export type Go2RTC = z.infer<typeof Go2RTCSchema>;

// Network/TLS/Proxy (global)
export const NetworkSchema = z.object({
  tls: z.object({
    enabled: z.boolean(),
    certfile: z.string().optional(),
    keyfile: z.string().optional()
  }).optional(),
  proxy: z.object({
    forward_headers: z.boolean().optional(),
    trusted_proxies: z.array(z.string()).optional()
  }).optional()
});
export type Network = z.infer<typeof NetworkSchema>;

// Main configuration schema
export const FrigateConfigSchema = z.object({
  mqtt: MQTTConfigSchema.optional(),
  cameras: z.record(CameraConfigSchema),
  audio: AudioConfigSchema.optional(),
  detectors: DetectorsSchema.optional(),
  go2rtc: Go2RTCSchema.optional(),
  network: NetworkSchema.optional()
});

// TypeScript types derived from the schemas
export type CameraConfig = z.infer<typeof CameraConfigSchema>;
export type MQTTConfig = z.infer<typeof MQTTConfigSchema>;
export type AudioConfig = z.infer<typeof AudioConfigSchema>;
export type FrigateConfig = z.infer<typeof FrigateConfigSchema>;