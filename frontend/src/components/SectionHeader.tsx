import { Box, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ icon, title, subtitle }: SectionHeaderProps) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4, pb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Box sx={{ fontSize: 40, color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
        <Typography variant="h4" component="h1" fontWeight={500} sx={{ letterSpacing: 1 }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ borderBottom: `2px solid ${theme.palette.divider}`, width: '100%', mb: 2, ml: 7 }} />
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ ml: 7, fontSize: 16 }} fontWeight={400}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionHeader; 