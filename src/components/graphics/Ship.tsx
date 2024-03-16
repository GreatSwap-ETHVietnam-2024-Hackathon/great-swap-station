import { ShipIcon } from "../icons";
import { keyframes } from "@emotion/react";
import { Box, BoxProps, SvgIconProps } from "@mui/material";

export default function Ship({
    duration,
    props,
    distance,
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
    opacity: 0;
    transform: translateX(0) translateY(0);
  }
  25% {
    opacity: 1;
    transform: translateY(${-distance / 4}px)
  }
  50% {
    opacity: 1;
    transform: translateY(${-distance / 2}px)
  }
  75% {
    opacity: 1;
    transform: translateY(${-distance / 4 * 3}px)
  }
  100% {
    opacity: 0;
    transform: translateY(${-distance}px)
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
                <ShipIcon {...props} />
            }
        </Box>
    )
}