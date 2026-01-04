import { Box, Card, CardContent, Grid, Switch, TextField, Typography, FormControlLabel } from '@mui/material';
import type { Network } from '../../shared/types/config';

interface Props {
  config?: Network;
  onChange: (config: Network) => void;
}

export default function NetworkConfig({ config, onChange }: Props) {
  const net = config || {} as Network;

  const setTLS = (field: 'enabled' | 'certfile' | 'keyfile', value: string | boolean) => {
    onChange({
      ...net,
      tls: { enabled: field === 'enabled' ? Boolean(value) : Boolean(net.tls?.enabled), certfile: net.tls?.certfile, keyfile: net.tls?.keyfile, [field]: value } as any
    });
  };

  const setProxy = (field: 'forward_headers' | 'trusted_proxies', value: boolean | string[]) => {
    onChange({
      ...net,
      proxy: { ...net.proxy, [field]: value } as any
    });
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Network / TLS / Proxy</Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>TLS</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={<Switch checked={Boolean(net.tls?.enabled)} onChange={(e) => setTLS('enabled', e.target.checked)} />}
                label="Enable TLS"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Certificate file" value={net.tls?.certfile || ''} onChange={(e) => setTLS('certfile', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Key file" value={net.tls?.keyfile || ''} onChange={(e) => setTLS('keyfile', e.target.value)} />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>Proxy</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={<Switch checked={Boolean(net.proxy?.forward_headers)} onChange={(e) => setProxy('forward_headers', e.target.checked)} />}
                label="Forward headers"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Trusted proxies (comma separated CIDR/IP)"
                value={(net.proxy?.trusted_proxies || []).join(', ')}
                onChange={(e) => setProxy('trusted_proxies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
