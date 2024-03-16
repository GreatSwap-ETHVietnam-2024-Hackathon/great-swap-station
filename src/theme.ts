import { createTheme, darkScrollbar, responsiveFontSizes } from '@mui/material';


const theme = responsiveFontSizes(createTheme({
    spacing: 4,

    typography: {
        fontFamily: [
            'Inter',
            'sans-serif'
        ].join(','),

        h1: {
            fontSize: '2rem',
            lineHeight: '1.5'
        },
        h2: {
            fontSize: '1.625rem',
            lineHeight: '1.5',
        },
        h3: {
            fontSize: '1rem',
            fontWeight: 500
        },
        h4: {
            fontSize: '1rem',
            fontWeight: 400
        },
        h6: {
            fontSize: '0.875rem',
            lineHeight: '1.5'
        },
        h5: {
            fontSize: '1rem',
            lineHeight: '1.5'
        },
        body1: {
            fontSize: '0.9rem',
            lineHeight: '1.5em',
            fontWeight: 400
        }
    },

    palette: {
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
        },
        primary: {
            main: 'rgb(49, 203, 158)',
            light: '#EEF9FB',
            dark: 'rgba(49, 203, 158, 0.3)',
        },
        secondary: {
            main: '#FFF',
            light: 'rgb(226, 177, 131, 0.2)',
            dark: '#F6F8F8'
        },
        error: {
            main: '#FB8900',
        },
        warning: {
            main: '#FB8900',
        },
        info: {
            main: '#6B7D6A',
        },
        success: {
            main: '#09FE00',
        },
        text: {
            primary: '#FFF',
            secondary: 'rgb(49, 203, 158)'
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    color: '#FFF',
                    /* width */
                    '*::-webkit-scrollbar': {
                        width: '0.4rem'
                    },

                    /* Handle */
                    '*::-webkit-scrollbar-thumb': {
                        background: '#E7E7E7',
                        borderRadius: '1rem'
                    },

                    /* Handle on hover */
                    '*::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: 'rgb(49, 203, 158)'
                    },
                }
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    height: '2.2rem',
                    cursor: "pointer",
                    borderRadius: '0.3rem',
                    padding: '0.3rem',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textTransform: 'none'
                },
                contained: {
                    background: 'linear-gradient(rgb(49, 203, 158), #06BCD5 109.21%)',
                    color: '#FFF',
                    '&:hover': {
                        background: 'linear-gradient(rgb(49, 203, 158,0.6), #06BCD5 109.21%)',
                    },
                    ":disabled": {
                        background: '#828687',
                        color: 'rgba(255, 255, 255, 0.5)'
                    },
                },
                outlined: {
                    background: '#FFF',
                    border: `0.1rem rgb(49, 203, 158) solid`,
                    fontWeight: '700',
                    '&:hover': {
                        background: 'rgb(49, 203, 158)',
                        color: '#FFF'
                    }
                }
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: 'rgb(49, 203, 158)',
                    '&.Mui-checked': {
                        color: 'rgb(49, 203, 158)',
                    },
                }
            }
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    padding: '0.4rem',
                    color: 'primary.main',
                },
                switchBase: {
                    color: '#FFF'
                },
                colorPrimary: {
                    "&.Mui-checked": {
                        // Controls checked color for the thumb
                        color: "#FFF"
                    }
                },
                track: {
                    borderRadius: 26 / 2,
                    backgroundColor: '#FFF'
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '0.875rem',
                    zIndex: '100',
                    lineHeight: '1',
                    paddingTop: '0.2rem',
                    paddingRight: '0.3rem',
                },
                shrink: {
                    fontSize: '1.2rem',
                    backgroundColor: '#4D4D4D',
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                    paddingRight: '0.5rem',
                    borderColor: 'rgb(49, 203, 158)',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgb(49, 203, 158)',
                    },
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgb(49, 203, 158)',
                    },
                },

            },
        },

        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#4D4D4D', // Change this to your desired color
                },
            },
        },

        // MuiFormControl: {
        //     styleOverrides: {
        //         root: {
        //             borderRadius: '0.5rem',
        //             border: '0.1rem solid rgb(49, 203, 158)'
        //         }
        //     }
        // },
    }
}));




export default theme;