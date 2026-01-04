import { Box, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import type { CameraConfig } from '../../shared/types/config';

interface Props {
  cameras?: Record<string, CameraConfig>;
  onChange: (cameras: Record<string, CameraConfig>) => void;
}

export default function ZonesMasksConfig({ cameras, onChange }: Props) {
  if (!cameras) {
    return <Typography variant="body1">No cameras configured.</Typography>;
  }

  const setZoneField = (name: string, zoneName: string, field: 'coordinates' | 'objects' | 'inertia' | 'loitering_time', value: any) => {
    const cam = cameras[name];
    const zones = cam.zones || {} as any;
    zones[zoneName] = { ...(zones[zoneName] || {}), [field]: value };
    onChange({ ...cameras, [name]: { ...cam, zones } });
  };

  const setMotionMask = (name: string, value: string) => {
    const cam = cameras[name];
    const motion = { ...(cam.motion || {}), mask: value } as any;
    onChange({ ...cameras, [name]: { ...cam, motion } });
  };

  return (
    <Box>
      {Object.entries(cameras).map(([name, cam]) => (
        <Card key={name} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>{name}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Motion mask (comma separated polygons)"
                  value={typeof cam.motion?.mask === 'string' ? cam.motion?.mask : (Array.isArray(cam.motion?.mask) ? cam.motion?.mask.join('; ') : '')}
                  onChange={(e) => setMotionMask(name, e.target.value)}
                  helperText="Enter polygon coordinates in percentage or pixels (e.g., 0.1,0.1,0.9,0.1,0.9,0.9,0.1,0.9). Multiple masks separated with ';'"
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Zones</Typography>
            {Object.entries(cam.zones || {}).map(([zName, zone]: any) => (
              <Grid container spacing={2} key={zName} sx={{ mb: 1 }}>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Zone name" value={zName} disabled />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Coordinates"
                    value={zone.coordinates || ''}
                    onChange={(e) => setZoneField(name, zName, 'coordinates', e.target.value)}
                    helperText="Polygon in percentages (recommended) or pixels"
                  />
                </Grid>
              </Grid>
            ))}

            {/* Simple adder: user types zone name + coordinates directly */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="New zone name" onBlur={(e) => setZoneField(name, e.target.value, 'coordinates', '')} placeholder="driveway" />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField fullWidth label="New zone coordinates" placeholder="0.1,0.1,0.9,0.1,0.9,0.9,0.1,0.9" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
