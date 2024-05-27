import push from 'web-push'
const vapidKeys = {
  publicKey:
    'BCykaAlOtZwChaoyEILvMBUlaE3_aTj1opSk185cbvMa9EAwDyGS--ckZ_4HfLEYzB7hI-c1ZHiAYDlkDTpZKow',
  privateKey: process.env.FCM_PRIVATE_KEY,
}

push.setVapidDetails(
  'mailto:arghyadas242004@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
)

export default push
