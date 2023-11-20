import { Box, Typography } from '@mui/material';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            className="h-full"
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Box className="h-full p-0" sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default CustomTabPanel;
