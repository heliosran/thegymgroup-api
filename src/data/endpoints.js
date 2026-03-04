export const endpointGroups = [
  {
    title: 'Authentication',
    endpoints: [
      { key: 'login', method: 'POST', path: '/np/exerciser/login', form: ['username', 'password'] },
      { key: 'oauthLogin', method: 'POST', path: '/np/exerciser/oauth2/login', form: ['provider', 'token'] },
      { key: 'logout', method: 'POST', path: '/np/logout' }
    ]
  },
  {
    title: 'Classes & Booking',
    endpoints: [
      { key: 'classes', method: 'GET', path: '/np/company/{companyUuid}/classes', pathParams: ['companyUuid'], query: ['startDateTime', 'endDateTime', 'exerciserUuid', 'type'] },
      { key: 'classDetails', method: 'GET', path: '/np/company/{companyUuid}/class/{classUuid}', pathParams: ['companyUuid', 'classUuid'] },
      { key: 'schedule', method: 'GET', path: '/np/exerciser/{exerciserUuid}/schedule', pathParams: ['exerciserUuid'], query: ['startDateTime', 'endDateTime', 'clubUuid'] },
      { key: 'addExerciser', method: 'POST', path: '/np/company/{companyUuid}/class/{classUuid}/addExerciser', pathParams: ['companyUuid', 'classUuid'], form: ['exerciserUuid', 'spot', 'type'] },
      { key: 'removeExerciser', method: 'POST', path: '/np/company/{companyUuid}/class/{classUuid}/removeExerciser', pathParams: ['companyUuid', 'classUuid'], form: ['exerciserUuid', 'type'] },
      { key: 'updateBooking', method: 'POST', path: '/np/company/{companyUuid}/class/{classUuid}/updateBooking', pathParams: ['companyUuid', 'classUuid'], form: ['exerciserUuid', 'spot'] },
      { key: 'waitlistAdd', method: 'POST', path: '/np/company/{companyUuid}/class/{classUuid}/waitlist/addExerciser', pathParams: ['companyUuid', 'classUuid'], form: ['exerciserUuid'] },
      { key: 'waitlistRemove', method: 'POST', path: '/np/company/{companyUuid}/class/{classUuid}/waitlist/removeExerciser', pathParams: ['companyUuid', 'classUuid'], form: ['exerciserUuid'] },
      { key: 'allowedOptionsClub', method: 'GET', path: '/np/company/{companyUuid}/allowedOptions', pathParams: ['companyUuid'] },
      { key: 'allowedOptionsBrand', method: 'GET', path: '/np/allowedOptions' }
    ]
  },
  {
    title: 'Gym & Check-ins',
    endpoints: [
      { key: 'gymBusyness', method: 'GET', path: '/np/thegymgroup/v1.0/exerciser/{exerciserUuid}/gym-busyness', pathParams: ['exerciserUuid'], query: ['gymLocationId'] },
      { key: 'historicalBusyness', method: 'GET', path: '/np/thegymgroup/v1.0/locations/{locationUuid}/historical-busyness', pathParams: ['locationUuid'], query: ['dayOfWeek'] },
      { key: 'checkinHistory', method: 'GET', path: '/np/exercisers/{exerciserUuid}/check-ins/history', pathParams: ['exerciserUuid'], query: ['startDate', 'endDate'] },
      { key: 'latestCheckin', method: 'GET', path: '/np/exercisers/{exerciserUuid}/latest-check-in', pathParams: ['exerciserUuid'] },
      { key: 'recurringReports', method: 'GET', path: '/np/exercisers/{exerciserUuid}/check-ins/recurring-reports', pathParams: ['exerciserUuid'] },
      { key: 'createReport', method: 'POST', path: '/np/exercisers/{exerciserUuid}/check-ins/report', pathParams: ['exerciserUuid'], form: ['email', 'frequency'] },
      { key: 'deleteReport', method: 'DELETE', path: '/np/exercisers/{exerciserUuid}/check-ins/recurring-reports/{reportUuid}', pathParams: ['exerciserUuid', 'reportUuid'] }
    ]
  },
  {
    title: 'Profile & Membership',
    endpoints: [
      { key: 'profileGet', method: 'GET', path: '/np/exerciser/{exerciserUuid}', pathParams: ['exerciserUuid'] },
      { key: 'profilePut', method: 'PUT', path: '/np/exerciser/{exerciserUuid}', pathParams: ['exerciserUuid'], json: ['firstName', 'lastName', 'phoneNumber'] },
      { key: 'avatarPost', method: 'POST', path: '/np/exerciser/{exerciserUuid}/avatar', pathParams: ['exerciserUuid'], form: ['avatarData'] },
      { key: 'avatarDelete', method: 'DELETE', path: '/np/exerciser/{exerciserUuid}/avatar', pathParams: ['exerciserUuid'] },
      { key: 'changePassword', method: 'POST', path: '/np/exerciser/changePassword', form: ['email', 'oldPassword', 'newPassword', 'confirmPassword'] },
      { key: 'passwordReset', method: 'POST', path: '/np/exerciser/password-reset', form: ['email', 'token', 'secret'] },
      { key: 'forgotPasscode', method: 'GET', path: '/np/exerciser/forgot-passcode', query: ['login'] },
      { key: 'validateUser', method: 'GET', path: '/np/exerciser/validate', query: ['xid', 'email'] },
      { key: 'membershipGet', method: 'GET', path: '/np/exerciser/{exerciserUuid}/membership', pathParams: ['exerciserUuid'] },
      { key: 'membershipPost', method: 'POST', path: '/np/exerciser/{exerciserUuid}/membership', pathParams: ['exerciserUuid'], form: ['barcode'] },
      { key: 'membershipActivate', method: 'POST', path: '/np/exerciser/{exerciserUuid}/membership/activate', pathParams: ['exerciserUuid'], form: ['barcode', 'agreement'] },
      { key: 'membershipBarcode', method: 'GET', path: '/np/exerciser/{exerciserUuid}/membership-barcode', pathParams: ['exerciserUuid'] },
      { key: 'googlePayBarcode', method: 'GET', path: '/np/exercisers/{exerciserUuid}/google/pay/barcode', pathParams: ['exerciserUuid'], query: ['appVersion', 'backgroundColor'] }
    ]
  },
  {
    title: 'Account, Schedule, Notifications',
    endpoints: [
      { key: 'accountBalance', method: 'GET', path: '/np/exerciser/{exerciserUuid}/account/balance', pathParams: ['exerciserUuid'], query: ['clubUuid', 'itemType'] },
      { key: 'bundles', method: 'GET', path: '/np/company/{companyUuid}/class/purchase/bundles', pathParams: ['companyUuid'], query: ['type', 'name'] },
      { key: 'purchaseBundle', method: 'POST', path: '/np/exerciser/{exerciserUuid}/class/purchase/bundle', pathParams: ['exerciserUuid'], form: ['type', 'clubUuid', 'id', 'price', 'taxRate', 'quantity'] },
      { key: 'payer', method: 'GET', path: '/np/exerciser/{exerciserUuid}/payer', pathParams: ['exerciserUuid'] },
      { key: 'forClubSchedule', method: 'GET', path: '/np/schedule/forClub/{clubUuid}', pathParams: ['clubUuid'] },
      { key: 'forClubPurchases', method: 'GET', path: '/np/purchases/forClub/{clubUuid}', pathParams: ['clubUuid'] },
      { key: 'notifications', method: 'GET', path: '/np/exerciser/{exerciserUuid}/notifications', pathParams: ['exerciserUuid'], query: ['startingFrom'] },
      { key: 'notificationRegister', method: 'POST', path: '/np/exerciser/{exerciserUuid}/notification', pathParams: ['exerciserUuid'], form: ['token', 'deviceUid', 'provider', 'providerId', 'version'] }
    ]
  },
  {
    title: 'Challenges & Activity Levels',
    endpoints: [
      { key: 'challengesActive', method: 'GET', path: '/np/exerciser/{exerciserUuid}/challenges/active', pathParams: ['exerciserUuid'] },
      { key: 'challengesPast', method: 'GET', path: '/np/exerciser/{exerciserUuid}/challenges/past-participated', pathParams: ['exerciserUuid'] },
      { key: 'challengeDetails', method: 'GET', path: '/np/exerciser/{exerciserUuid}/challenge/{challengeId}', pathParams: ['exerciserUuid', 'challengeId'] },
      { key: 'challengeJoin', method: 'POST', path: '/np/exerciser/{exerciserUuid}/challenge/{challengeId}', pathParams: ['exerciserUuid', 'challengeId'], query: ['command'], form: ['timeZone'] },
      { key: 'challengeProgress', method: 'GET', path: '/np/exerciser/{exerciserUuid}/challenge/{challengeId}/progress-history', pathParams: ['exerciserUuid', 'challengeId'], query: ['timezone'] },
      { key: 'challengeParticipants', method: 'GET', path: '/np/exerciser/{exerciserUuid}/challenge/{challengeId}/participants', pathParams: ['exerciserUuid', 'challengeId'], query: ['pageSize', 'start'] },
      { key: 'challengePrize', method: 'GET', path: '/np/challenge/{challengeId}/prize', pathParams: ['challengeId'] },
      { key: 'challengePrizeImage', method: 'GET', path: '/np/challenge/{challengeId}/prize/image', pathParams: ['challengeId'] },
      { key: 'activityDefinitions', method: 'GET', path: '/analysis/api/v1.0/exercisers/{exerciserUuid}/activitylevels/definitions', pathParams: ['exerciserUuid'], query: ['languageCode'] },
      { key: 'activityLevel', method: 'GET', path: '/analysis/api/v1.0/exercisers/{exerciserUuid}/activitylevels', pathParams: ['exerciserUuid'] },
      { key: 'ranking', method: 'GET', path: '/analysis/api/v1.0/exercisers/{exerciserUuid}/ranking', pathParams: ['exerciserUuid'], query: ['languageCode', 'shift'] },
      { key: 'leaderboard', method: 'GET', path: '/analysis/api/v1.0/exercisers/{exerciserUuid}/ranking/leaderboard', pathParams: ['exerciserUuid'], query: ['languageCode', 'size', 'nextPageToken'] },
      { key: 'rankingWithLeaderboard', method: 'GET', path: '/analysis/api/v1.0/exercisers/{exerciserUuid}/rankingwithleaderboard', pathParams: ['exerciserUuid'], query: ['languageCode', 'size'] }
    ]
  },
  {
    title: 'Feedback, Referrals, eGym & Extras',
    endpoints: [
      { key: 'appFeedback', method: 'POST', path: '/np/exerciser/{exerciserUuid}/app-rating-feedback', pathParams: ['exerciserUuid'], form: ['message'] },
      { key: 'locationFeedback', method: 'POST', path: '/np/exerciser/{exerciserUuid}/location-feedbacks', pathParams: ['exerciserUuid'], json: ['rating', 'message'] },
      { key: 'requestTrainer', method: 'POST', path: '/np/exerciser/{exerciserUuid}/request-trainer', pathParams: ['exerciserUuid'], form: ['type', 'comments', 'phone', 'topic'] },
      { key: 'requestAssessment', method: 'POST', path: '/np/exerciser/{exerciserUuid}/request-fitness-assessment', pathParams: ['exerciserUuid'], form: ['comments', 'phone'] },
      { key: 'referralConfig', method: 'GET', path: '/np/exerciser/referral-config' },
      { key: 'referClassic', method: 'POST', path: '/np/exerciser/{exerciserUuid}/rewards/refer-a-friend', pathParams: ['exerciserUuid'], form: ['email'] },
      { key: 'referExtended', method: 'POST', path: '/np/exerciser/{exerciserUuid}/refer-friend', pathParams: ['exerciserUuid'], form: ['firstName', 'lastName', 'email', 'phone'] },
      { key: 'trialPass', method: 'POST', path: '/np/exerciser/trial-pass', form: ['firstName', 'lastName', 'homeClub', 'email', 'phone'] },
      { key: 'checklist', method: 'GET', path: '/np/thegymgroup/v1.0/exercisers/{exerciserUuid}/checklist', pathParams: ['exerciserUuid'] },
      { key: 'preference', method: 'GET', path: '/np/thegymgroup/v1.0/exercisers/{exerciserUuid}/preference', pathParams: ['exerciserUuid'] },
      { key: 'egymUserByEmail', method: 'GET', path: '/np/egym/v1.0/users', query: ['email'] },
      { key: 'egymRegister', method: 'POST', path: '/np/egym/v1.0/users/{exerciserUuid}/register', pathParams: ['exerciserUuid'] },
      { key: 'egymLinkingStatus', method: 'GET', path: '/np/egym/v1.0/users/{exerciserUuid}/linking-status', pathParams: ['exerciserUuid'] },
      { key: 'egymLink', method: 'POST', path: '/np/egym/v1.0/users/{exerciserUuid}/link', pathParams: ['exerciserUuid'] },
      { key: 'egymUnlink', method: 'POST', path: '/np/egym/v1.0/users/{exerciserUuid}/unlink', pathParams: ['exerciserUuid'] },
      { key: 'egymAcceptTac', method: 'POST', path: '/np/egym/v1.0/users/{exerciserUuid}/accept-tac', pathParams: ['exerciserUuid'] },
      { key: 'egymOptInsGet', method: 'GET', path: '/np/egym/v1.0/users/{exerciserUuid}/opt-ins', pathParams: ['exerciserUuid'] },
      { key: 'egymOptInsSet', method: 'POST', path: '/np/egym/v1.0/users/{exerciserUuid}/opt-ins', pathParams: ['exerciserUuid'], json: ['marketing', 'thirdParty'] },
      { key: 'egymSetPassword', method: 'POST', path: '/np/egym/v1.0/users/{exerciserUuid}/set-password', pathParams: ['exerciserUuid'], form: ['password'] },
      { key: 'egymResetPassword', method: 'POST', path: '/np/egym/v1.0/users/reset-password', form: ['email'] },
      { key: 'connectedApps', method: 'GET', path: '/np/workouts/v2.1/exercisers/{exerciserUuid}/external-workouts/connected-apps', pathParams: ['exerciserUuid'] },
      { key: 'manualBarcodesGet', method: 'GET', path: '/np/manual-barcodes/v1.0/exercisers/{exerciserUuid}/barcodes', pathParams: ['exerciserUuid'] },
      { key: 'manualBarcodesPost', method: 'POST', path: '/np/manual-barcodes/v1.0/exercisers/{exerciserUuid}/barcodes', pathParams: ['exerciserUuid'], json: ['label', 'code'] },
      { key: 'manualBarcodesPut', method: 'PUT', path: '/np/manual-barcodes/v1.0/exercisers/{exerciserUuid}/barcodes/{barcodeId}', pathParams: ['exerciserUuid', 'barcodeId'], json: ['label', 'code'] },
      { key: 'manualBarcodesDelete', method: 'DELETE', path: '/np/manual-barcodes/v1.0/exercisers/{exerciserUuid}/barcodes/{barcodeId}', pathParams: ['exerciserUuid', 'barcodeId'] },
      { key: 'nfaConfig', method: 'GET', path: '/np/nfa/config', query: ['brandId', 'resourceType'] },
      { key: 'resolveContainer', method: 'GET', path: '/np/nfa/resolveContainer', query: ['keyword', 'containerAppVersion'] },
      { key: 'verificationTan', method: 'GET', path: '/np/exercisers-verification/v1.0/exercisers/{exerciserUuid}/verification-tan', pathParams: ['exerciserUuid'] },
      { key: 'partnerToken', method: 'GET', path: '/np/exerciser/{exerciserUuid}/externalAccount/matrixPortal/token', pathParams: ['exerciserUuid'], query: ['club_uuid'] }
    ]
  }
];

export const allEndpoints = endpointGroups.flatMap((group) => group.endpoints);
