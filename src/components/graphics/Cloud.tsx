import { CloudLTRIcon, CloudRTLIcon } from "../icons";
import { keyframes } from "@emotion/react";
import { Box, BoxProps, SvgIconProps } from "@mui/material";

export default function Cloud({
    leftToRight,
    duration,
    distance,
    props,
    boxProps
}: {
    leftToRight: boolean,
    duration: number,
    distance: number,
    props: SvgIconProps,
    boxProps: BoxProps
}) {

    const animKeyFrame = keyframes({
        '0%': {
            opacity: 0,
            transform: `translateX(0px)`,
        },
        '25%': {
            opacity: 1,
            transform: `translateX(${distance / 4}px)`,
        },
        '50%': {
            opacity: 1,
            transform: `translateX(${distance / 2}px)`,
        },
        '75%': {
            opacity: 1,
            transform: `translateX(${3 * distance / 4}px)`,
        },
        '100%': {
            opacity: 0,
            transform: `translateX(${distance}px)`,
        },
    });

    const cloudAnimation = `${animKeyFrame} ${duration}s infinite linear`;

    return (
        <Box
            {...boxProps}
            sx={{
                position: 'absolute',
                animation: cloudAnimation
            }}
        >
            {
                leftToRight ? <CloudLTRIcon {...props} /> : <CloudRTLIcon {...props} />
            }
        </Box>
    )
}