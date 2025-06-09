import { Step, TradeDirection } from '../types';
import forexPairs from './forexPairs';

export const steps: Record<string, Step> = {
  forexPairSelection: {
    id: 'forexPairSelection',
    title: 'Trade Direction',
    description: 'Select your trade direction and choose the instrument to validate:',
    progressBarLabel: 'Trade Setup',
    options: forexPairs.map(pair => ({
      id: pair.id,
      label: pair.label
    })),
    rules: [
      {
        id: 'pairSelected',
        description: 'Select a forex trading pair to continue with validation',
        images: []
      }
    ],
    nextStep: 'h4Initial',
    getRules: (selectedOption: string, tradeDirection?: TradeDirection) => [
      {
        id: 'pairSelected',
        description: 'Select a forex trading pair to continue with validation',
        images: []
      }
    ]
  },
  h4Initial: {
    id: 'h4Initial',
    title: 'H4 Candle Validation',
    description: 'Select the H4 Candle Close:',
    progressBarLabel: 'H4 Confirm',
    options: [
      { id: 'MANIPIB', label: 'MANIP Inside Bar' },
      { id: 'NonMANIPIB', label: 'Non MANIP Inside Bar' },
      { id: 'MANIPNONMSBENGULF', label: 'MANIP NON MSB ENGULF' },
      { id: 'NonMANIPNONMSBENGULF', label: 'Non MANIP NON MSB ENGULF' },
      { id: 'SC', label: 'SINGLE CANDLE' },
      { id: 'LQW', label: 'LQW' },
      { id: 'ENGULFMSB', label: 'ENGULF MSB/SCMSB' },
      { id: 'SCMSBA', label: 'SCMSB After NH/NL' }
    ],
    rules: [],
    nextStep: 'dailyRules',
    getRules: (selectedOption: string, tradeDirection: TradeDirection = 'buy') => {
      // For now, return the same rules regardless of trade direction
      // You can customize these based on tradeDirection in the future
      switch (selectedOption) {
        case 'MANIPIB':
          return [
            {
              id: 'rule1',
              description: 'Closing into H4 Empty Space or NON MSB STRUCTURE.',
              exceptions: [
                'Manip Inside Bar is closing into H1 Empty Space…AND..your H4 NH/NL against didnt do a NH/NL manip pattern',
                'Manip Inside Bar is closing into H1 non msb structure…AND..your H4 NH/NL against didnt do a NH/NL manip pattern'
              ],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749205345/emptyspace_zie9ad.png',
                  alt: 'Example of H4 Manip Inside Bar closing into H4 Empty Space or Non MSB Structure'
                }
              ]
            },
            {
              id: 'rule2',
              description: `Supported by/trapped inside H4 Structure Body Zone. 
              If theres LQW infront of the body zone, INVALID`,
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749205984/LQWinfornt_zplsx5.jpg',
                  alt: 'Example of LQW infront of body zone - INVALID'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749206378/2025-06-06_11-37-47_qmvvha.jpg',
                  alt: 'VALID supported by H4 structure'
                }
              ]
            },
            {
              id: 'rule3',
              description: 'Is not a NH or NL directly after nothing single candle in NH/NL manip pattern leg',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749206879/Picture3_r6dirr.jpg',
                  alt: 'Example showing invalid NH/NL pattern after single candle that is in a NH/NL pattern'
                }
              ]
            },
            {
              id: 'rule4',
              description: 'CAN NOT be directly after SCMSB NH/NL candle. Check all feeds if Engulf MSB looks close to being SCMSB',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749214510/Picture4_zwse2a.jpg',
                  alt: 'Example showing invalid Manip Inside Bar after SCMSB NH/NL candle'
                }
              ]
            },
            {
              id: 'rule5',
              description: 'If in Empty Space formed by most recent structure, the structure before current Empty Space CAN NOT be coming off H4 SCMSB after NH/NL in day before structure.',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749214730/Picture5_lpqgpl.jpg',
                  alt: 'INVALID Example of structure before current coming off H4 SCMSB after NH/NL in day before'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749214952/Picture6_rok14z.jpg',
                  alt: 'INVALID Example of structure before current coming off H4 SCMSB after NH/NL in day before '
                }
              ]
            }
          ];
      
        
        case 'NonMANIPIB':
          return [
            {
              id: 'rule1',
              description: 'HL/LH high coming off the most recent H4 NH/NL level AND it took out the open of the structure candle that makes the H4 NH/NL level.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749217851/2025-06-06_14-45-59_kvtdfx.jpg',
                  alt: 'Example of HL/LH pattern coming off H4 NH/NL level taking out structure candle'
                }
              ]
             },
            {
              id: 'rule2',
              description: 'HL/LH coming off the most recent H4 SCMSB after NH/NL level',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749218051/Picture12_dh1svt.jpg',
                  alt: 'Example of HL/LH pattern from H4 SCMSB after NH/NL level'
                }
              ]
            },
            {
              id: 'rule3',
              description: 'Its a NL/NH manip pattern of most recent structure wick.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749217852/Picture7_koutzj.jpg',
                  alt: 'Example of NL/NH manip pattern on structure wick'
                }
              ]
            },
            {
              id: 'rule4',
              description: 'Its a HL/LH manip pattern of the most recent structure wick.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749217854/Picture8_afdmkx.jpg',
                  alt: 'Example of HL/LH manip pattern on structure wick'
                }
              ]
            },
            {
              id: 'rule5',
              description: 'Its a NH/NL coming off most recent Non MSB structure..AND..closing into H1 empty space.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749217855/Picture9_sadhsv.jpg',
                  alt: 'Example of NH/NL from Non MSB structure closing into H1 empty space'
                }
              ]
            },
            {
              id: 'rule6',
              description: 'It manipulates a H4 NH/NL structure wick from the same day or previous day.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749217850/Picture10_yceqcd.jpg',
                  alt: 'VALID Example of manipulation of H4 NH/NL structure wick'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749217926/Picture11_jssknu.jpg',
                  alt: 'INVALID Example'
                }
              ]
            }
          ];

        
        case 'MANIPNONMSBENGULF':
          return [
            {
              id: 'rule1',
              description: 'Closing into H4 Empty Space or NON MSB structure.',
              exceptions: [
                'Manip Non MSB Engulf is closing into H1 Empty Space…AND..your H4 NH/NL against didnt do a NH/NL manip pattern...OR',
                'Manip Non MSB Engulf is closing into H1 non msb structure…AND..your H4 NH/NL against didnt do a NH/NL manip pattern'
                ],
                
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749220716/Picture13_gr6bff.png',
                  alt: 'H4 Manip Non MSB Engulf closing & tapping into H4 Empty Space…OR…NON MSB STRUCTURE'
                }
              ]
            },
            {
              id: 'rule2',
              description: `Supported by/trapped inside any H4 Structure Body Zone. 
                If there\'s LQW infront of the body zone, INVALID`,
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749220938/Picture14_zqlfbb.jpg',
                  alt: 'Example of LQW infront of body zone - INVALID'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749220940/Picture15_q6yew2.jpg',
                  alt: 'Example of LQW infront of body zone - INVALID'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749220942/Picture16_om2gc1.png',
                  alt: 'Valid EXAMPLE'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749220944/Picture17_zq8kwj.png',
                  alt: 'Valid EXAMPLE'
                }
                
              ]
            },
            {
              id: 'rule3',
              description: 'CAN NOT be directly after SCMSB NH/NL candle.Check all feeds if Engulf MSB looks close to being SCMSB',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749221568/Picture19_tcto6x.jpg',
                  alt: 'INVALID Example of Non MSB Engulf after SCMSB NH/NL candle'
                }
              ]
            },
            {
              id: 'rule4',
              description: 'If in Empty Space formed by most recent structure, the structure before your Empty Space cannot be coming off H4 SCMSB after NH/NL in day before structure.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749221568/Picture19_tcto6x.jpg',
                  alt: 'INVALID Example of Non MSB ENgulf after SCMSB NH/NL candle'
                }
              ]
            },
          ];

          case 'NonMANIPNONMSBENGULF':
          return [
            {
              id: 'rule1',
              description: 'Trapped in any H4 NH/NL level.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749223700/Picture22_o84uil.jpg',
                  alt: 'Example of price trapped in H4 NH Level'
                }
              ]
             },
            {
              id: 'rule2',
              description: 'Its coming off most recent LQW that close over most recent structure.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749223702/Picture23_o1frwn.jpg',
                  alt: 'Example Coming off most recent LQW that closes over recent structure'
                }
              ]
            },
            {
              id: 'rule3',
              description: 'Its a NL or NH manip pattern of most recent structure wick.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749223696/Picture24_kpbup5.jpg',
                  alt: 'Example of NL manip pattern of most recent structure wick.'
                }
              ]
            },
            {
              id: 'rule4',
              description: 'Its a HL or LH manip pattern of most recent structure wick.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749223697/Picture25_qimvhk.jpg',
                  alt: 'Example of HL manip pattern of most recent structure wick'
                }
              ]
            },
            {
              id: 'rule5',
              description: 'Supported by most recent Manip IB or Non msb manip engulf.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749223698/Picture26_wgjyqq.jpg',
                  alt: 'Example of Supported by recent Manip IB or Non MSB Engulf'
                }
              ]
            },
            {
              id: 'rule6',
              description: 'It manipulates a H4 NH/NL structure wick from the same day or previous day.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749217850/Picture10_yceqcd.jpg',
                  alt: 'Example of manipulation of H4 NH/NL structure wick'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749217926/Picture11_jssknu.jpg',
                  alt: 'INVALID Example'
                }
              ]
            }
          ];

        case 'SC':
          return [
            {
              id: 'rule1',
              description: 'Closing into H4 Empty Space or NON MSB structure',
              exceptions: [
                'Single candle is closing into H1 Empty Space…AND..your h4 NH/NL against didnt do a NH/NL manip pattern',
                'Single candle is closing into H1 non msb structure…AND..your h4 NH/NL against didnt do a NH/NL manip pattern'
              ],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749225010/Picture28_khgocr.png',
                  alt: 'Example of single candle closing into H4 empty space and NON MSB structure'
                }
              ]
            },
            {
              id: 'rule2',
              description: 'Is NOT a nothing candle. i.e It didnt take out the High or Low of the previous candle.',
              images: []
            },
            {
              id: 'rule3',
              description: 'If H4 Structure before your single candle is Manip IB or Manip NON MSB Engulf, they must be supported by/trapped inside any H4 Structure Body Zone. If there\'s LQW infront of the body zone, your H4 must STILL be in line with tapping the BODY zone. ',
              exceptions: ['TO STRUCTURE BEFORE - If the IB/NON MSB Engulf before your single candle is not trapped in structure ...then your single candle can still be valid if it closed back inside a structure wick. '],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749225013/Picture29_ylpico.jpg',
                  alt: 'INVALID Example of LQW infront of body zone'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749225015/Picture30_dct76m.png',
                  alt: 'Example Manip Non MSB Engulf supported by another H4 structure'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749225242/Picture31_otukrv.png',
                  alt: 'Example Manip IB supported by another H4 structure and Manip IB supported by H4 structure with LWQ in front of it'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749225245/Picture32_jveptt.jpg',
                  alt: 'Example Manip IB supported by another H4 structure and Manip IB supported by H4 structure with LWQ in front of it'
                },
              ]
            },
            {
              id: 'rule4',
              description: 'Is NOT a NH or NL on ANY FEED..i.e It cannot close over any previous H4 structure or structure wicks. ',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749225247/Picture33_evu2ge.jpg',
                  alt: 'Example of single candle closing back inside structure'
                }
              ]
            },
            {
              id: 'rule5',
              description: 'If in Empty Space formed by most recent structure, the structure before your Empty Space CAN NOT be coming off H4 SCMSB after NH/NL in day before structure. ',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749225009/Picture35_hdufsb.jpg',
                  alt: 'INVALID Example of previous structure before current empty space coming off H4 SCMSB NL structure'
                }
              ]
            },
          ];
        case 'LQW':
          return [
            {
              id: 'rule1',
              description: 'Closing into H4 Empty Space Or NON MSB structure.',
              exceptions: [
                'LQW is closing into H1 Empty Space…AND..your h4 NH/NL against didnt do a NH/NL manip pattern...OR',
                'LQW is closing into H1 non msb structure…AND..your h4 NH/NL against didnt do a NH/NL manip pattern'
                ],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749227468/Picture36_r4aqoo.png',
                  alt: 'Example of LQW closing in H4 empty space and NON MSB Structure'
                }
              ]
            },
            {
              id: 'rule2',
              description: 'Is directly after a structure candle (H or L).',
              exceptions: ['It manipulates the most recent structure wick'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749227473/Picture37_gnxydg.jpg',
                  alt: 'Example of LQW manipulating most recent stucture'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749227581/Picture38_wby8l8.jpg',
                  alt: 'INVALID Example of LQW not after structure candle'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749227476/Picture39_bhwooe.jpg',
                  alt: 'INVALID Example of LQW not after structure candle'
                }
              ]
            },
            {
              id: 'rule3',
              description: 'If H4 Structure before your LQW is Manip IB or Manip NON MSB Engulf, they must be supported by/trapped inside any H4 Structure Body Zone. If there\'s LQW infront of the body zone, your H4 must STILL be in line with tapping the BODY zone. ',
              exceptions: [
                'If the IB/NON MSB Engulf before your LQW is not trapped in structure ...your LQW can still be valid if it closed back inside a structure wick.',
                'Your LQW manips recent structure wick.'             
              ],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749227573/Picture40_xlv3wi.jpg',
                  alt: 'Example of LQW infront of H4 structure zone'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749227478/Picture41_mdr8so.png',
                  alt: 'Example of LQW supported by H4 structure body zone'
                },
              ]
            },
            {
              id: 'rule4',
              description: 'CAN NOT be a NH or NL on ANY FEED',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749227578/Picture42_z0bqur.jpg',
                  alt: 'Example of candle creating a new high not LQW though'
                }
              ]
            },
            {
              id: 'rule5',
              description: 'If LQW is in Empty Space formed by most recent structure, the structure before your Empty Space cannot be coming off H4 SCMSB after NH/NL in day before structure.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749227470/Picture44_jfo6v0.jpg',
                  alt: 'INVALID Example of structure before current empty space is coming off H4 SCMSB NH/NL in day before.'
                }
              ]
            },
          ];
        case 'ENGULFMSB':
          return [
            {
              id: 'rule1',
              description: 'Closing into H4 Empty Space OR NON MSB STRUCTURE.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749231403/Picture45_xptn0n.png',
                  alt: 'Example of Engulf MSB and SCMSB closing into empty space'
                }
              ]
            },
            {
              id: 'rule2',
              description: 'Previous day MUST be the same direction close.',
              images: []
            },
            {
              id: 'rule3',
              description: 'H1 NH/NL MUST is WITHIN the H4 Engulf MSBs structure',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749231405/Picture46_inrxft.jpg',
                  alt: 'H4'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749231408/Picture47_iud2ie.jpg',
                  alt: 'H1'
                }
              ]
            },
            {
              id: 'rule4',
              description: 'Is not tappping into H4 NH/NL against even if there is H1 empty space.',
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule5',
              description: 'Structure before your Engulf MSB/SCMSB candle CAN NOT tap into LQW manip of NH/NL structures wicks.',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749231401/Picture48_tufzkx.jpg',
                  alt: 'Example of Engulf SCMSB tapping into LQW Manip NH structure'
                }
              ]
            },
          ];
        case 'SCMSBA':
          return [
            {
              id: 'rule1',
              description: 'Closing into H4 Empty Space OR NON MSB STRUCTURE.',
              exceptions: ['Can close/tap into any H4 supply/demand level against you IF H4 SCMSB after NH/NL is closing/tapping into H1 Empty Space or Non MSB H1 structure.'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749233457/Picture49_rbho13.png',
                  alt: 'Example of SCMSB forming immediately after NH/NL'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749233460/Picture50_soeseh.jpg',
                  alt: 'H4'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749233455/Picture51_nwp3wx.jpg',
                  alt: 'H1'
                }
              ]
            },
            {
              id: 'rule2',
              description: 'Previous day MUST be the same direction close',
              images: []
            },
            {
              id: 'rule3',
              description: 'SCMSB after NH/NL doesn\'t need to be supported by any h4 structure.',
              images: []
            }
          ];
        default:
          return [];
      }
    }
  },
  dailyRules: {
    id: 'dailyRules',
    title: 'Daily Rules',
    description: 'Validate against daily timeframe rules:',
    progressBarLabel: 'Daily Rules',
    options: [],
    rules: [],
    nextStep: 'h1Confirmation',
    getOptions: (prevStepSelectedOption: string | null, tradeDirection: TradeDirection = 'buy') => {
      // If H4 Initial selection is ENGULFMSB or SCMSBA, only show Previous Same option
      if (prevStepSelectedOption === 'ENGULFMSB' || prevStepSelectedOption === 'SCMSBA') {
        return [
          { id: 'PrevSame', label: 'Previous Day Same direction rules' }
        ];
      }
      
      // For all other selections, show both options
      return [
        { id: 'PrevSame', label: 'Previous Day Same direction rules' },
        { id: 'PrevOpp', label: 'Previous Day Opposite direction rules' }
      ];
    },
    getRules: (selectedOption: string, tradeDirection: TradeDirection = 'buy') => {
      switch (selectedOption) {
        case 'PrevSame':
          return [
            {
              id: 'rule1',
              description: 'H4 same direction candle must close inside the open wick of the daily same direction.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235125/Picture52_r4i7jg.png',
                  alt: 'PREVIOUS DAY SAME DIRECTION'
                }
              ]
            },
            {
              id: 'rule2',
              description: 'If H4 candle closed over previous day close wick, the open wick of your H4 MUST be within the range of the previous day same direction candle.',
              allowNA: true,
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235128/Picture53_l7hv7d.png',
                  alt: 'PREVIOUS DAY SAME DIRECTION H4 closed above close wick but open wick of H4 within range of Previous day'
                }
              ]
            },
            {
              id: 'rule3',
              description: 'Previous day cant tap into SCMSB after NH/NL against you',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235119/Picture60_zcolxj.png',
                  alt: 'PREVIOUS DAY SAME DIRECTION Tapping into SCMSB NL Level'
                }
              ]
            },
            {
              id: 'rule4',
              description: 'Previous day cant tap into LQW SCMSB after NH/NL against you',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235122/Picture61_edbdnw.png',
                  alt: 'PREVIOUS DAY SAME DIRECTION Tapping into LQW SCMSB NL Level against you'
                }
              ]
            },
            {
              id: 'rule5',
              description: 'Current day candle CAN NOT be a LQW forming against trade direction',
              allowNA: true,
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235136/Picture56_gdo8cd.png',
                  alt: 'Current day candle CAN NOT be LQW at H/L of your H4 Candle.'
                }
              ]
            },
            {
              id: 'rule6',
              description: 'Current day candle CAN NOT be SCMSB forming against trade direction.',
              allowNA: true,
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235139/Picture57_esthsa.png',
                  alt: 'Current opposite day CAN NOT be SCMSB after NH/NL over 2x structures at the H/L of your H4 candle'
                }
              ]
            }
          ];
        
        case 'PrevOpp':
          return [
            {
              id: 'rule1',
              description: 'Your H4 candle must close inside the close wick of the daily opposite direction.',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235130/Picture54_uw882q.png',
                  alt: 'PREVIOUS DAY OPPOSITE DIRECTION'
                }
              ]
            },
            {
              id: 'rule2',
              description: 'If your H4 candle closed over previous days OPPOSITE day open wick, the open wick of your H4 opposite candle MUST be within the range of the previous opposite direction candle.',
              allowNA: true,
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235133/Picture55_j1kip7.png',
                  alt: 'PREVIOUS DAY OPPOSITE DIRECTION - H4 closed over previous day open wick, but H4 open wick is within range of previous opposite day candle '
                }
              ]
            },
            {
              id: 'rule3',
              description: 'Previous day opposite isnt SCMSB after a NH/NL.',
              exceptions: ['The current week is same direction over previous weeks high/low.'],
              images: []
            },
            {
              id: 'rule4',
              description: 'Previous day opposite open wick isnt coming off SCMSB after NH/NL against you on ANY feed.',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url:'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235245/Picture58_s2h7bj.png',
                  alt:'Previous day opposite open wick cant come off SCMSB after NH/NL against you'
                }
               ]
            },
            {
              id: 'rule5',
              description: 'Previous day opposite candle cant come off "LQW directly after SCMSB after NH/NL" against you',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url:'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235143/Picture59_wtxhta.png',
                  alt:'Previous day opposite direction cant come off "LQW directly after SCMSB after NH/NL" against you'
                }
              ]
            },
            {
              id: 'rule6',
              description: 'Current day candle CAN NOT be a LQW forming against trade direction',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235136/Picture56_gdo8cd.png',
                  alt: 'Current day candle CAN NOT be LQW at H/L of your H4 Candle.'
                }
              ]
            },
            {
              id: 'rule7',
              description: 'Current day candle CAN NOT be SCMSB forming against trade direction',
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749235139/Picture57_esthsa.png',
                  alt: 'Current opposite day CAN NOT be SCMSB after NH/NL over 2x structures at the H/L of your H4 candle'
                }
              ]
            }
            ];
        
               
        default:
          return [];
      }
    }
  },
  h1Confirmation: {
    id: 'h1Confirmation',
    title: 'H1 Confirmation',
    description: 'Validate H1 confirm candle:',
    progressBarLabel: 'H1 Confirm',
    options: [
      { id: 'H1MANIPIB', label: 'H1 MANIP IB HL/LH' },
      { id: 'H1NONMANIPIB', label: 'H1 NON MANIP IB HL/LH' },
      { id: 'H1MANIPNONMSNENGULF', label: 'H1 MANIP NON MSB ENGULF HL/LH' },
      { id: 'H1NONMANIPNONMSNENGULF', label: 'H1 NON MANIP NON MSB ENGULF HL/LH' },
      { id: 'H1MANIPSCMSB', label: 'H1 MANIP NORMAL SCMSB HL/LH' },
      { id: 'H1LQW', label: 'H1 LQW AFTER HL/LH STRUCTURE CANDLE HL/LH' }
    ],
    rules: [],
    nextStep: undefined,
    getRules: (selectedOption: string, tradeDirection: TradeDirection = 'buy') => {
      switch (selectedOption) {
        case 'H1MANIPIB':
          return [
            {
              id: 'rule1',
              description: 'Closed inside H4 same direction open wick',
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule2',
              description: 'H1 NH/NL closed over the most recent structure wick OR at worst be the exact same price as most recent structure wick',
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule3',
              description: 'H1 NH/NL closed into Empty Space or Non MSB structure',
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule4',
              description: 'If your H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB',
              allowNA: true,
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749239988/Picture62_vfeviq.jpg',
                  alt: 'H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749239986/Picture63_lmbqht.jpg',
                  alt: 'H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB'
                }
                  ]
            },
            {
              id: 'rule5',
              description: `Closing/Tapping into:
• H1 Empty Space or
• H1 NON MSB IB structure (any) or 
• H1 NON MSB Engulf structure (any)`,
              exceptions: ['NO EXCEPTION'],
              images: []
            }
          ];

        case 'H1NONMANIPIB':
          return [
            {
              id: 'rule1',
              description: 'Closed inside H4 same direction open wick',
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule2',
              description: 'H1 NH/NL closed over the most recent structure wick OR at worst be the exact same price as most recent structure wick',
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule3',
              description: 'H1 NH/NL closed into either Empty Space or Non MSB structure',
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule4',
              description: 'If your H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB',
              allowNA: true,
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749239988/Picture62_vfeviq.jpg',
                  alt: 'H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749239986/Picture63_lmbqht.jpg',
                  alt: 'H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB'
                }
                  ]
            },
            {
              id: 'rule5',
              description: `Confirm candle closing/tapping into:
• H1 Empty Space or
• H1 NON MSB IB structure (any) or
• H1 NON MSB Engulf structure (any)`,
              exceptions: ['NO EXCEPTION'],
              images: []
            }
          ];

        case 'H1MANIPNONMSNENGULF':
          return [
            {
              id: 'rule1',
              description: 'Closed inside H4 same direction open wick.',
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule2',
              description: 'The single candle before you Manip NON MSB Engulf cannot be a NOTHING single candle.',
              exceptions: ['H1 manip non msb engulf is coming off SCMSB after NH/NL body zone.'],
              images: []
            },
            {
              id: 'rule3',
              description: 'H1 NH/NL closed over the most recent structure wick OR at least be the exact same price as most recent structure wick. ',
              exceptions: ['NO EXCEPTION'],
              images: []   
            },
            {
              id: 'rule4',
              description: 'Confirm candle coming off H1 NH/NL level. is HL or LH off the level.',
              images: []
            },
             {
              id: 'rule5',
              description: `Your H1 NH/NL level MUST tap/close into either:
• Empty Space
• Non MSB structure`,
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule6',
              description: 'If H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB',
              allowNA: true,
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749239988/Picture62_vfeviq.jpg',
                  alt: 'H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749239986/Picture63_lmbqht.jpg',
                  alt: 'H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB'
                }
                ]
            },
            {
              id: 'rule7',
              description: `Confirm candle closing/Tapping into:
• H1 Empty Space or 
• H1 NON MSB IB structure (any) or
• H1 NON MSB Engulf structure (any)`,
              exceptions: ['NO EXCEPTION'],
              images: []
            }
                
          ];

        case 'H1NONMANIPNONMSNENGULF':
          return [
            {
              id: 'rule1',
              description: 'Closed inside H4 same direction open wick.',
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule2',
              description: 'The single candle before your NON Manip NON MSB Engulf cannot be a NOTHING single candle.',
              exceptions: ['H1 non manip non msb engulf is coming off SCMSB after NH/NL body zone.'],
              images: []
            },
            {
              id: 'rule3',
              description: 'H1 NH/NL level closed over the most recent structure wick OR at worst be the exact same price as most recent structure wick. ',
              exceptions: ['NO EXCEPTION'],
              images: []   
            },
            {
              id: 'rule4',
              description: 'Confirm candle coming off H1 NH/NL level. Is HL or LH off the level.',
              images: []
            },
             {
              id: 'rule5',
              description: `H1 NH/NL level MUST tap/close into either:
• Empty Space
• Non MSB structure`,
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule6',
              description: 'If H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB',
              allowNA: true,
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749239988/Picture62_vfeviq.jpg',
                  alt: 'H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749239986/Picture63_lmbqht.jpg',
                  alt: 'H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB'
                }
                ]
            },
            {
              id: 'rule7',
              description: `Confirm candle Closing/Tapping into:
• H1 Empty Space
• H1 NON MSB IB structure (any)
• H1 NON MSB Engulf structure (any)`,
              exceptions: ['NO EXCEPTION'],
              images: []
            }
          ];

        case 'H1MANIPSCMSB':
          return [
            {
              id: 'rule1',
              description: 'MUST BE MANIP candle',
              exceptions: ['NO EXCEPTION'],
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749242049/Picture65_z7mdv9.jpg',
                  alt: 'Example of H1 Manip SCMSB setup'
                }
              ]
            },
            {
              id: 'rule2',
              description: 'Coming off H1 NH/NL level. Is HL or LH off the level.',
              images: []
            },
            {
              id: 'rule3',
              description: 'H1 NH/NL level closed over the most recent structure wick OR at least be the exact same price as most recent structure wick',
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule4',
              description: `H1 NH/NL level MUST tap/close into either:
• Empty Space
• Non MSB structure`,
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule5',
              description: 'If H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB',
              allowNA: true,
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749239988/Picture62_vfeviq.jpg',
                  alt: 'H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB'
                },
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749239986/Picture63_lmbqht.jpg',
                  alt: 'H1 NH/NL is V2 "SCMSB after NH/NL" there CAN NOT be a LQW in the leg prior to your SCMSB'
                }
                ]
            }
          ];

        case 'H1LQW':
          return [
            {
              id: 'rule1',
              description: 'H1 Manip IB/NON MSB Engulf directly before your LQW CAN NOT Manip recent structure wick against. ',
              exceptions: [
                'H1 manip IB/Non msb engulf manipulates the structure wick off your H1 NH/NL level like the image above.',
                'H1 manip IB/Non msb engulf is coming off engulf msb/scmsb that closed over structure wick.'
              ],
              images: []
            },
            {
              id: 'rule2',
              description: 'Closed inside H4 same direction open wick',
              exceptions: ['NO EXCEPTION'],
              images: []
            },
            {
              id: 'rule3',
              description: `Any type of Candle before your LQW (structure candle H or L) has made HL or LH.
• Your LQW manips that structure wick. 
• The structure candle can be NON Manip AND doesnt need to be supported by anything.`,
              images: []
            },
           {
              id: 'rule4',
              description: `Candle directly before LQW is Engulf MSB/SCMSB?
Your Engulf MSB/SCMSB directly before LQW is HL/LH`,
              exceptions: ['NO EXCEPTION'],
              allowNA: true,
              images: []
            },
            {
              id: 'rule5',
              description: `If structure candle before LQW is Engulf MSB/SCMSB 
• it must close over most recent structure wicks 
• or LQW must close over the structure wicks
• or LQW closes over the most recent structure wick the Engulf MSB/SCMSB failed to close over`,
              exceptions: ['NO EXCEPTION'],
              allowNA: true,
              images: [
                {
                  url: 'https://res.cloudinary.com/dnfpmva9e/image/upload/v1749242049/Picture65_z7mdv9.jpg',
                  alt: 'Example of H1 Manip SCMSB setup'
                }
              ]
            },
            {
              id: 'rule6',
              description: `If structure candle before LQW is IB/NON MSB Engulf and made HL/LH:
• LQW doesnt need to come off/tap the H1 NH/NL level, it just has to be a HL/LH high after it.`,
              allowNA: true,
              images: []
            },
            {
              id: 'rule7',
              description: 'Your IB or NON MSB Engulf directly before your LQW CAN NOT tap into H1 NH/NL against. ',
              exceptions: ['NO EXCEPTION'],
              allowNA: true,
              images: []
            },
            {
              id: 'rule8',
              description: 'The H1 NH/NL level before your LQW MUST close over its most recent structure wick OR at least be the exact same price as most recent structure wick.',
              images: []
            },
            {
              id: 'rule9',
              description: 'The H1 NH/NL level directly before your LQW must close/tap into empty space or non msb structure.',
              images: []
            }
          ];

        default:
          return [];
      }
    }
  }
};