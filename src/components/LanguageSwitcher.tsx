import { Button, Menu, MenuItem } from '@mui/material';
import { Languages } from 'lucide-react';
import { useTranslationPath } from '../hooks/useTranslationPath';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export function LanguageSwitcher() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t: tLanguages } = useTranslationPath('languages');
  const { i18n } = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          color: 'inherit',
          '& .MuiButton-startIcon': {
            marginInlineEnd: 1,
            marginInlineStart: -0.5
          }
        }}
        startIcon={<Languages />}
      >
        {tLanguages(i18n.language)}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => changeLanguage('en')}>
          {tLanguages('en')}
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('he')}>
          {tLanguages('he')}
        </MenuItem>
      </Menu>
    </>
  );
}