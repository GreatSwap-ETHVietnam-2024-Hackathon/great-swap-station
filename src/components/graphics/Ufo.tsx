import { UfoIcon } from "../icons";
import { keyframes } from "@emotion/react";
import { Box, BoxProps, SvgIconProps } from "@mui/material";

export default function Ufo({
    duration,
    props,
    boxProps,
    distance,
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
    transform:  translateX(${distance / 4}px) translateY(${-distance / 4}px);
  }
  50% {
    opacity: 1;
    transform: translateX(${distance / 2}px) translateY(${-distance / 2}px);
  }
  75% {
    opacity: 1;
    transform:  translateX(${distance / 4 * 3}px) translateY(${-distance / 4 * 3}px);
  }
  100% {
    opacity: 0;
    transform: translateX(${distance}px) translateY(${-distance}px);
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
                <UfoIcon {...props} />
            }
        </Box>
    )
}