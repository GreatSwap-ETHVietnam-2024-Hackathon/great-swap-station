import { Box } from "@mui/material";
import Circle from "./graphics/Circle";
import Cloud from "./graphics/Cloud";
import Plus from "./graphics/Plus";
import { EarthIcon, SpiralIcon } from "./icons";
import Earth from "./graphics/Earth";
import Planet from "./graphics/Planet";
import Ship from "./graphics/Ship";
import Ufo from "./graphics/Ufo";
import { useWalletContext } from "src/contexts/wallet";

export default function Background() {
    const { metamaskAccount } = useWalletContext();
    return <Box
        sx={{
            zIndex: -1,
            background: 'black',
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            filter: metamaskAccount ? 'blur(0.05rem)' : ''
        }}
    >
        {/* <Earth
            delay={0}
            duration={10}
            distance={100}
            boxProps={{
                style: {
                    top: 500,
                    right: 100
                }
            }}
            props={{
                style: {
                    width: 50,
                    height: 50
                }
            }}
        />
        <Planet
            delay={0}
            duration={10}
            distance={100}
            boxProps={{
                style: {
                    top: 300,
                    left: 0
                }
            }}
            props={{
                style: {
                    width: 120,
                    height: 120
                }
            }}>
        </Planet>
        <Planet
            delay={0}
            duration={10}
            distance={100}
            boxProps={{
                style: {
                    bottom: 150,
                    left: "40%"
                }
            }}
            props={{
                style: {
                    width: 120,
                    height: 120
                }
            }}>
        </Planet>
        <Ship delay={5}
            duration={20}
            distance={400}
            boxProps={{
                style: {
                    bottom: 300,
                    right: 200
                }
            }}
            props={{
                style: {
                    width: 40,
                    height: 40
                }
            }}>

        </Ship>
        <Ship delay={0}
            duration={20}
            distance={400}
            boxProps={{
                style: {
                    bottom: 200,
                    left: 300
                }
            }}
            props={{
                style: {
                    width: 40,
                    height: 40
                }
            }}>

        </Ship>
        <Ufo
            delay={0}
            duration={20}
            distance={400}
            boxProps={{
                style: {
                    bottom: 400,
                    left: 100
                }
            }}
            props={{
                style: {
                    width: 40,
                    height: 40
                }
            }}>

        </Ufo>
        <Ufo
            delay={2}
            duration={20}
            distance={400}
            boxProps={{
                style: {
                    bottom: 20,
                    right: 500
                }
            }}
            props={{
                style: {
                    width: 40,
                    height: 40
                }
            }}>

        </Ufo> */}
        <Box sx={{
            position: 'absolute',
            right: -20,
            bottom: 200
        }}>
            <SpiralIcon />
        </Box>
    </Box>
}