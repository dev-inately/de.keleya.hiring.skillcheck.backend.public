export default {
  users: [
    {
      id: 1,
      name: 'Elaine Hamill',
      email: 'Allen_Nienow@fake-mail.com',
      email_confirmed: false,
      is_admin: false,
      credentials_id: 1,
      created_at: '2022-03-23T03:29:35.026Z',
      updated_at: '2022-03-23T03:29:35.030Z',
      deleted_at: null,
      credential: null,
    },
    {
      id: 2,
      name: 'Richard Cypher',
      email: 'rcypher@fake-mail.com',
      email_confirmed: false,
      is_admin: false,
      credentials_id: 2,
      created_at: '2022-03-24T03:29:35.026Z',
      updated_at: '2022-03-24T03:29:35.030Z',
      deleted_at: null,
    },
  ],
  credentials: [
    {
      id: 1,
      hash: '$2b$10$lCuXr7T1tpAKwzo/Oxillu0T2W5wC2CkmDlCpiwprW8n9hOk.Bonm',
      created_at: '2022-03-21T03:29:35.026Z',
      updated_at: '2022-03-21T03:29:35.030Z',
    },
    {
      id: 2,
      hash: '$a223sdsadasdas.sadasde4ffdcvds',
      created_at: '2022-03-14T03:29:35.026Z',
      updated_at: '2022-03-14T03:29:35.030Z',
    },
  ],
  token: null,
};
