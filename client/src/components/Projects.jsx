import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';

export default function Projects() {
  const sample = [
    { id: 1, name: 'Website Redesign', updatedAt: Date.now() - 1000 * 60 * 60 * 24 },
    { id: 2, name: 'Mobile App', updatedAt: Date.now() - 1000 * 60 * 60 * 5 },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Projects</Typography>
      <Grid container spacing={2}>
        {sample.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography color="text.secondary" variant="body2">Updated {new Date(p.updatedAt).toLocaleString()}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" size="small" href={`/projects/${p.id}`}>Open</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
