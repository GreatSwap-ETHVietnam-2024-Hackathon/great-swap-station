import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { StepConnector, StepIconProps, styled } from '@mui/material';

const CustomizedConnector = styled(StepConnector)(({ theme }) => ({
    "& .MuiStepConnector-completed .MuiStepConnector-lineHorizontal": {
        borderColor: "rgb(49, 203, 158)",
        borderStyle: "solid",
        borderWidth: 0.8,
    },
    "& .MuiStepConnector-active .MuiStepConnector-lineVertical": {
        borderLeftColor: "rgb(49, 203, 158)",
        borderLeftStyle: "solid",
    },
    "& .MuiStepConnector-completed .MuiStepConnector-lineVertical": {
        borderLeftColor: "rgb(49, 203, 158)",
        borderLeftStyle: "solid",
    },
    "& .MuiStepConnector-lineVertical": {
        borderLeftColor: "rgb(49, 203, 158)",
        borderLeftStyle: "solid",
    },
}));
function StepIcon(props: StepIconProps) {
    const highlighted = props.completed || props.active
    return <Box sx={{
        width: '36px',
        height: '36px',
        border: '1px solid rgb(49, 203, 158)',
        transform: 'translateX(-0.4em)',
        borderRadius: '50%',
        borderColor: 'rgb(49, 203, 158)',
        background: highlighted ? 'rgb(49, 203, 158)' : 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <Typography
            variant='h5'
            sx={{
                fontWeight: 600,
                textAlign: 'center',
                color: highlighted ? 'white' : 'rgb(49, 203, 158)'
            }}>
            {props.icon}
        </Typography>
    </Box>
}
export default function VerticalLinearStepper({ labels, activeIndex }: { labels: string[], activeIndex: number }) {

    return (
        <Box sx={{ maxWidth: 400 }}>
            <Stepper
                activeStep={activeIndex}
                orientation="vertical"
                connector={<CustomizedConnector />}
            >
                {labels.map((label) => (
                    <Step key={label}>
                        <StepLabel sx={{
                            padding: 0
                        }}
                            StepIconComponent={StepIcon}>
                            <Typography color='white'>{label}</Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}