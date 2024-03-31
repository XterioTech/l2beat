import { EthereumAddress, formatSeconds, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('xterio', 'bsc')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const FINALIZATION_PERIOD_SECONDS: number = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

const sequencerWindowSize = 14400  // 12h with l1 block 3s

export const xterio: Layer2 = opStack({
  discovery,
  display: {
    name: 'Xterio Chain',
    slug: 'xterio',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Xterio Chain is an Optimistic Rollup that has been developed on the BNB Chain network, utilizing OP Stack technology.',
    purposes: ['Gaming'],
    links: {
      websites: ['https://xter.io/'],
      apps: ['https://xter.io/', 'https://bridge.xter.io/'],
      documentation: ['https://stack.optimism.io/'],
      explorers: [
        'https://xterscan.io/',
      ],
      repositories: ['https://github.com/XterioTech'],
      socialMedia: [
        'https://twitter.com/XterioGames',
        'https://discord.gg/xterio',
        'https://medium.com/@XterioGames',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Xterio Chain is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        sequencerWindowSize,
      )} or until it gets published. The state root gets finalized ${formatSeconds(
        FINALIZATION_PERIOD_SECONDS,
      )} after it has been posted.`,
    },
    finality: {
      finalizationPeriod: FINALIZATION_PERIOD_SECONDS,
    },
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0xC3671e7E875395314bBad175b2b7F0EF75DA5339',
  ),
  rpcUrl: 'https://xterio.alt.technology',
  finality: {
    type: 'OPStack-blob',
    minTimestamp: new UnixTime(1711544386),
    genesisTimestamp: new UnixTime(1711531215),
    l2BlockTimeSeconds: 2,
    lag: 0,
  },
  genesisTimestamp: new UnixTime(1711531215),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  isNodeAvailable: true,
  milestones: [],
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplateEscrows: [],
  nonTemplatePermissions: [],
  nonTemplateContracts: [
    discovery.getContractDetails('L1ERC721Bridge', {
      description:
        'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
      ...upgradeability,
    })
  ],
  chainConfig: {
    name: 'Xterio Chain',
    chainId: 112358,
    explorerUrl: 'https://xterscan.io',
    explorerApi: {
      url: 'https://xterscan.io/api',
      type: 'blockscout',
    },
    // ~ Timestamp of block number 0 on Base
    // https://xterscan.io/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-03-27T09:20:15Z')),    
    multicallContracts: [],
  },
  usesBlobs: true,
})
