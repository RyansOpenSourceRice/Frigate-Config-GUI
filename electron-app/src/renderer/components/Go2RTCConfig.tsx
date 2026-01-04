import { Box, Card, CardContent, Grid, TextField, Typography, Button } from '@mui/material';
import type { Go2RTC } from '../../shared/types/config';
import { useState } from 'react';

interface Props {
  config?: Go2RTC;
  onChange: (config: Go2RTC) => void;
}

export default function Go2RTCConfig({ config, onChange }: Props) {
  const [newName, setNewName] = useState('frontdoor');
  const [newValue, setNewValue] = useState('rtsp://...#video=copy');

  const streams = config?.streams || {};

  const addStream = () => {
    if (!newName.trim() || !newValue.trim()) return;
    onChange({ streams: { ...streams, [newName]: newValue } });
    setNewName('');
    setNewValue('');
  };

  const setStream = (name: string, value: string) => {
    onChange({ streams: { ...streams, [name]: value } });
  };

  const removeStream = (name: string) => {
    const next: Record<string, string> = { ...streams };
    delete next[name];
    onChange({ streams: next });
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>go2rtc Streams</Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField fullWidth label="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="rtsp://...#video=copy" />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="contained" onClick={addStream} disabled={!newName.trim() || !newValue.trim()}>Add</Button>
            </Grid>
          </Grid>

          {Object.entries(streams).map(([name, val]) => (
            <Grid container spacing={2} alignItems="center" key={name} sx={{ mb: 1 }}>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Name" value={name} disabled />
              </Grid>
              <Grid item xs={12} md={7}>
                <TextField fullWidth label="Value" value={val} onChange={(e) => setStream(name, e.target.value)} />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button color="error" onClick={() => removeStream(name)}>Remove</Button>
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
