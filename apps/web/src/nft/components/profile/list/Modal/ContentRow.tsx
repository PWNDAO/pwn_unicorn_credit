import Loader from 'components/Icons/LoadingSpinner'
import Column from 'components/deprecated/Column'
import Row from 'components/deprecated/Row'
import styled, { css, useTheme } from 'lib/styled-components'
import { VerifiedIcon } from 'nft/components/icons'
import { AssetRow, CollectionRow, ListingStatus } from 'nft/types'
import { getMarketplaceIcon } from 'nft/utils'
import { useEffect, useRef } from 'react'
import { Check, XOctagon } from 'react-feather'
import { Trans } from 'react-i18next'
import { ThemedText } from 'theme/components'
import { opacify } from 'theme/utils'

const ContentColumn = styled(Column)<{ failed: boolean }>`
  background-color: ${({ theme, failed }) => failed && opacify(12, theme.critical)};
  border-radius: 12px;
  padding-bottom: ${({ failed }) => failed && '16px'};
`

const ContentRowWrapper = styled(Row)<{ active: boolean; failed: boolean }>`
  padding: 16px;
  border: ${({ failed, theme }) => !failed && `1px solid ${theme.surface3}`};
  border-radius: 12px;
  opacity: ${({ active, failed }) => (active || failed ? '1' : '0.6')};
`

const CollectionIcon = styled.img`
  border-radius: 100px;
  height: 24px;
  width: 24px;
  z-index: 1;
`

const AssetIcon = styled.img`
  border-radius: 4px;
  height: 24px;
  width: 24px;
  z-index: 1;
`

const MarketplaceIcon = styled.div`
  border-radius: 4px;
  height: 24px;
  width: 24px;
  margin-left: -4px;
  margin-right: 12px;
`

const ContentName = styled(ThemedText.SubHeaderSmall)`
  color: ${({ theme }) => theme.neutral1};
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 40%;
`

const ProceedText = styled.span`
  font-weight: 535;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.neutral2};
`

const FailedText = styled.span`
  font-weight: 535;
  font-size: 10px;
  line-height: 12px;
  color: ${({ theme }) => theme.critical};
  margin-left: 4px;
`

const StyledVerifiedIcon = styled(VerifiedIcon)`
  height: 16px;
  width: 16px;
  margin-left: 4px;
`

const IconWrapper = styled.div`
  margin-left: auto;
  margin-right: 0px;
`

const ButtonRow = styled(Row)`
  padding: 0px 16px;
  justify-content: space-between;
`

const failedButtonStyle = css`
  width: 152px;
  cursor: pointer;
  padding: 8px 0px;
  text-align: center;
  font-weight: 535;
  font-size: 14px;
  line-height: 16px;
  border-radius: 12px;
  border: none;

  &:hover {
    opacity: 0.6;
  }
`

const RemoveButton = styled.button`
  background-color: ${({ theme }) => theme.critical};
  color: ${({ theme }) => theme.neutral1};
  ${failedButtonStyle}
`

const RetryButton = styled.button`
  background-color: ${({ theme }) => theme.surface3};
  color: ${({ theme }) => theme.neutral1};
  ${failedButtonStyle}
`

export const ContentRow = ({
  row,
  isCollectionApprovalSection,
  removeRow,
}: {
  row: AssetRow
  isCollectionApprovalSection: boolean
  removeRow: (row: AssetRow) => void
}) => {
  const theme = useTheme()
  const rowRef = useRef<HTMLDivElement>()
  const failed = row.status === ListingStatus.FAILED || row.status === ListingStatus.REJECTED

  useEffect(() => {
    row.status === ListingStatus.SIGNING && rowRef.current?.scroll
  }, [row.status])

  return (
    <ContentColumn failed={failed}>
      <ContentRowWrapper
        active={row.status === ListingStatus.SIGNING || row.status === ListingStatus.APPROVED}
        failed={failed}
        ref={rowRef}
      >
        {isCollectionApprovalSection ? <CollectionIcon src={row.image} /> : <AssetIcon src={row.image} />}
        <MarketplaceIcon>{getMarketplaceIcon(row.marketplace.name, '24')}</MarketplaceIcon>
        <ContentName>{row.name}</ContentName>
        {isCollectionApprovalSection && (row as CollectionRow).isVerified && <StyledVerifiedIcon />}
        <IconWrapper>
          {row.status === ListingStatus.DEFINED || row.status === ListingStatus.PENDING ? (
            <Loader
              height="14px"
              width="14px"
              stroke={row.status === ListingStatus.PENDING ? theme.accent1 : theme.neutral3}
            />
          ) : row.status === ListingStatus.SIGNING ? (
            <ProceedText>
              <Trans i18nKey="common.proceedInWallet.short" />
            </ProceedText>
          ) : row.status === ListingStatus.APPROVED ? (
            <Check height="20" width="20" stroke={theme.success} />
          ) : (
            failed && (
              <Row>
                <XOctagon height="20" width="20" color={theme.critical} />
                <FailedText>
                  {row.status === ListingStatus.FAILED ? (
                    <Trans i18nKey="common.failed.error" />
                  ) : (
                    <Trans i18nKey="common.rejected" />
                  )}
                </FailedText>
              </Row>
            )
          )}
        </IconWrapper>
      </ContentRowWrapper>
      {failed && (
        <ButtonRow justify="space-between">
          <RemoveButton onClick={() => removeRow(row)}>
            <Trans i18nKey="common.remove.label" />
          </RemoveButton>
          <RetryButton onClick={row.callback}>
            <Trans i18nKey="common.button.retry" />
          </RetryButton>
        </ButtonRow>
      )}
    </ContentColumn>
  )
}
