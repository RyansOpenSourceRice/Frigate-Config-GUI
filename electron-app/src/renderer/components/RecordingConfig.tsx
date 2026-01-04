import { Box, Card, CardContent, Grid, Switch, TextField, Typography, FormControlLabel } from '@mui/material';
import type { CameraConfig } from '../../shared/types/config';

interface Props {
  cameras?: Record<string, CameraConfig>;
  onChange: (cameras: Record<string, CameraConfig>) => void;
}

export default function RecordingConfig({ cameras, onChange }: Props) {
  if (!cameras) {
    return <Typography variant="body1">No cameras configured.</Typography>;
  }

  const setField = (name: string, _path: (cfg: CameraConfig) => any, assign: (cfg: CameraConfig) => CameraConfig) => {
    const next = { ...cameras };
    next[name] = assign(cameras[name]);
    onChange(next);
  };

  return (
    <Box>
      {Object.entries(cameras).map(([name, cam]) => (
        <Card key={name} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>{name}</Typography>

            <FormControlLabel
              control={<Switch checked={Boolean(cam.record?.enabled)} onChange={(e) => setField(name, c => c.record?.enabled, (c) => ({ ...c, record: { ...c.record, enabled: e.target.checked } as any }))} />}
              label="Enable recording"
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Retain days"
                  value={cam.record?.retain?.days ?? 0}
                  onChange={(e) => setField(name, c => c.record?.retain?.days, (c) => ({ ...c, record: { ...c.record, retain: { ...c.record?.retain, days: parseInt(e.target.value, 10) || 0 } } as any }))}
                  disabled={!cam.record?.enabled}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Retain mode"
                  value={cam.record?.retain?.mode || 'all'}
                  onChange={(e) => setField(name, c => c.record?.retain?.mode, (c) => ({ ...c, record: { ...c.record, retain: { ...c.record?.retain, mode: e.target.value as any } } as any }))}
                  disabled={!cam.record?.enabled}
                  helperText="all | motion | active_objects"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Pre-capture (s)"
                  value={cam.record?.events?.pre_capture ?? 5}
                  onChange={(e) => setField(name, c => c.record?.events?.pre_capture, (c) => ({ ...c, record: { ...c.record, events: { ...c.record?.events, pre_capture: parseInt(e.target.value, 10) || 0 } } as any }))}
                  disabled={!cam.record?.enabled}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Post-capture (s)"
                  value={cam.record?.events?.post_capture ?? 5}
                  onChange={(e) => setField(name, c => c.record?.events?.post_capture, (c) => ({ ...c, record: { ...c.record, events: { ...c.record?.events, post_capture: parseInt(e.target.value, 10) || 0 } } as any }))}
                  disabled={!cam.record?.enabled}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Snapshots</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={<Switch checked={Boolean(cam.snapshots?.enabled)} onChange={(e) => setField(name, c => c.snapshots?.enabled, (c) => ({ ...c, snapshots: { ...c.snapshots, enabled: e.target.checked } as any }))} />}
                  label="Enable snapshots"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quality (1-100)"
                  value={cam.snapshots?.quality ?? ''}
                  onChange={(e) => setField(name, c => c.snapshots?.quality, (c) => ({ ...c, snapshots: { ...c.snapshots, quality: parseInt(e.target.value, 10) || undefined } as any }))}
                  disabled={!cam.snapshots?.enabled}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
