import { Layer3 } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'

import { makeTechnologyChoice } from '../../common/makeTechnologyChoice'
import { TechnologySectionProps } from '../../components/sections/TechnologySection'

export function getTechnologyOverview(
  project: Layer3,
): Omit<TechnologySectionProps, 'sectionOrder'>[] {
  const technology: Omit<TechnologySectionProps, 'sectionOrder'> = {
    id: 'technology',
    title: 'Technology',
    isUnderReview: project.isUnderReview ?? project.technology.isUnderReview,
    items: [
      project.technology.stateCorrectness &&
        makeTechnologyChoice(
          'state-correctness',
          project.technology.stateCorrectness,
        ),
      project.technology.newCryptography &&
        makeTechnologyChoice(
          'new-cryptography',
          project.technology.newCryptography,
        ),
      project.technology.dataAvailability &&
        makeTechnologyChoice(
          'data-availability',
          project.technology.dataAvailability,
        ),
    ].filter(notUndefined),
  }

  const operator: Omit<TechnologySectionProps, 'sectionOrder'> = {
    id: 'operator',
    title: 'Operator',
    isUnderReview: project.isUnderReview ?? project.technology.isUnderReview,
    items: [
      project.technology.operator &&
        makeTechnologyChoice('operator', project.technology.operator),
      project.technology.forceTransactions &&
        makeTechnologyChoice(
          'force-transactions',
          project.technology.forceTransactions,
        ),
    ].filter(notUndefined),
  }

  const withdrawals: Omit<TechnologySectionProps, 'sectionOrder'> = {
    id: 'withdrawals',
    title: 'Withdrawals',
    isUnderReview: project.isUnderReview ?? project.technology.isUnderReview,
    items: [
      ...(project.technology.exitMechanisms ?? []).map((x, i) =>
        makeTechnologyChoice(`exit-mechanisms-${i + 1}`, x),
      ),
      project.technology.massExit &&
        makeTechnologyChoice('mass-exit', project.technology.massExit),
    ].filter(notUndefined),
  }

  const other: Omit<TechnologySectionProps, 'sectionOrder'> = {
    id: 'other-considerations',
    title: 'Other considerations',
    isUnderReview: project.isUnderReview ?? project.technology.isUnderReview,
    items:
      project.technology.otherConsiderations?.map((x, i) =>
        makeTechnologyChoice(`other-considerations-${i + 1}`, x),
      ) ?? [],
  }

  const filtered = [technology, operator, withdrawals, other].filter(
    (x) => x.items.length > 0,
  )

  return filtered.map((section) => {
    if (section.items.every((item) => item.isUnderReview)) {
      return { ...section, isUnderReview: true }
    }
    return section
  })
}
