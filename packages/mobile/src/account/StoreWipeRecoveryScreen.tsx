import Button, { BtnTypes } from '@celo/react-components/components/Button'
import KeyboardSpacer from '@celo/react-components/components/KeyboardSpacer'
import fontStyles from '@celo/react-components/styles/fonts'
import { Spacing } from '@celo/react-components/styles/styles'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { chooseRestoreAccount, setPincode } from 'src/account/actions'
import { PincodeType } from 'src/account/reducer'
import { Namespaces } from 'src/i18n'
import { emptyHeader } from 'src/navigator/Headers'
import { navigate } from 'src/navigator/NavigationService'
import { Screens } from 'src/navigator/Screens'
import { StackParamList } from 'src/navigator/types'
import { requestPincodeInput } from 'src/pincode/authentication'
import useSelector from 'src/redux/useSelector'
import Logger from 'src/utils/Logger'

type Props = StackScreenProps<StackParamList, Screens.StoreWipeRecoveryScreen>

const TAG = 'StoreWipeRecoveryScreen'

function StoreWipeRecoveryScreen({ route }: Props) {
  const { t } = useTranslation(Namespaces.accountScreen10)
  const acceptedTerms = useSelector((state) => state.account.acceptedTerms)
  const dispatch = useDispatch()

  const goToOnboarding = async () => {
    try {
      const account = route.params.account
      await requestPincodeInput(true, false, account)

      dispatch(chooseRestoreAccount(true))
      dispatch(setPincode(PincodeType.CustomPin))

      if (!acceptedTerms) {
        navigate(Screens.RegulatoryTerms)
      } else {
        navigate(Screens.NameAndPicture)
      }
    } catch (error) {
      Logger.error(`${TAG}@goToOnboarding`, 'PIN error', error)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} testID={'StoreWipeRecovery'}>
          {t('storeRecoveryTitle')}
        </Text>
        <Text style={styles.body}>{t('storeRecoveryBody')}</Text>
        <Button
          onPress={goToOnboarding}
          text={t('storeRecoveryButton')}
          type={BtnTypes.PRIMARY}
          testID="GoToOnboarding"
        />
      </ScrollView>
      <KeyboardSpacer />
    </View>
  )
}

StoreWipeRecoveryScreen.navOptions = {
  ...emptyHeader,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginHorizontal: 24,
  },
  title: {
    ...fontStyles.h1,
    marginTop: 80,
    paddingBottom: Spacing.Regular16,
    paddingTop: Spacing.Regular16,
  },
  body: {
    ...fontStyles.large,
    paddingBottom: Spacing.Thick24,
  },
})

export default StoreWipeRecoveryScreen
