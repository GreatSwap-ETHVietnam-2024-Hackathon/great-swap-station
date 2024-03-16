import { PlanetIcon } from "../icons";
import { keyframes } from "@emotion/react";
import { Box, BoxProps, SvgIconProps } from "@mui/material";

export default function Planet({
    duration,
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

    const animKeyFrame = keyframes`
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(50px)
  }
  100% {
    transform: translateX(0) translateY(0);
  }
`;

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
                <PlanetIcon {...props} />
            }
        </Box>
    )
}