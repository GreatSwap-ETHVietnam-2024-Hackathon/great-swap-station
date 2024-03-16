import { PlusIcon } from "../icons";
import { keyframes } from "@emotion/react";
import { Box, BoxProps, SvgIconProps } from "@mui/material";

export default function Plus({
    duration,
    distance,
    props,
    boxProps,
    delay
}: {
    duration: number,
    distance: number,
    props: SvgIconProps,
    boxProps: BoxProps,
    delay: number
}) {

    const animKeyFrame = keyframes({
        '0%': {
            opacity: 0,
            transform: `translateY(0px)`,
        },
        '25%': {
            opacity: 1,
            transform: `translateY(${-distance / 4}px)`,
        },
        '50%': {
            opacity: 1,
            transform: `translateY(${-distance / 2}px)`,
        },
        '75%': {
            opacity: 1,
            transform: `translateY(${-3 * distance / 4}px) rotate(90deg)`,
        },
        '100%': {
            opacity: 0,
            transform: `translateY(${-distance}px) rotate(90deg)`,
        },
    });

    const cloudAnimation = `${animKeyFrame} ${duration}s infinite linear`;

    return (
        <Box
            {...boxProps}
            sx={{
                position: 'absolute',
                animationDelay: `${delay}s`,
                animation: cloudAnimation
            }}
        >
            {
                <PlusIcon {...props} />
            }
        </Box>
    )
}