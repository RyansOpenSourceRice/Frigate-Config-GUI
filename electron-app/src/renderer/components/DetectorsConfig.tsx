import { useState } from 'react';
import { Box, Card, CardContent, Grid, TextField, Typography, IconButton, Button } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Detectors } from '../../shared/types/config';

interface Props {
  config: Detectors;
  onChange: (config: Detectors) => void;
}

export default function DetectorsConfig({ config, onChange }: Props) {
  const [newName, setNewName] = useState('cpu1');

  const detectors = config || {};

  const addDetector = () => {
    if (!newName.trim()) return;
    onChange({
      ...detectors,
      [newName]: { type: 'cpu' }
    });
    setNewName('');
  };

  const removeDetector = (name: string) => {
    const next = { ...detectors };
    delete next[name];
    onChange(next);
  };

  const setField = (name: string, field: 'type' | 'device', value: string) => {
    onChange({
      ...detectors,
      [name]: { ...detectors[name], [field]: value }
    });
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Detectors</Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField fullWidth label="New detector name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </Grid>
            <Grid item>
              <Button variant="contained" startIcon={<AddIcon />} onClick={addDetector} disabled={!newName.trim()}>Add</Button>
            </Grid>
          </Grid>

          {Object.entries(detectors).map(([name, det]) => (
            <Card key={name} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Name" value={name} disabled />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Type (cpu, edgetpu, openvino)" value={det.type} onChange={(e) => setField(name, 'type', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Device (optional)" value={det.device || ''} onChange={(e) => setField(name, 'device', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <IconButton color="error" onClick={() => removeDetector(name)}><DeleteIcon /></IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
