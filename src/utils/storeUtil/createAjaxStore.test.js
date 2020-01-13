import createAjaxStore from './createAjaxStore';

describe('createAjaxStore', () => {
  test('simple config', () => {
    const store = createAjaxStore({
      name: 'product',
      actions: {
        request: () => ({}),
      },
    });
    expect(Array.isArray(store)).toBeTruthy();
    expect(typeof store[0] === 'object').toBeTruthy();
    expect(typeof store[0].request === 'function').toBeTruthy();
    expect(typeof store[0].cancel === 'function').toBeTruthy();
    expect(typeof store[1] === 'function').toBeTruthy();
  });

  test('complex config', () => {
    const store = createAjaxStore({
      name: 'user',
      slices: [
        {
          name: 'hobbies',
          actions: {
            request: () => ({}),
          },
        },
        {
          name: 'friends',
          actions: {
            request: () => ({}),
          },
        },
        {
          name: 'addresses',
          slices: [
            {
              name: 'home',
              actions: {
                request: () => ({}),
              },
            },
            {
              name: 'company',
              actions: {
                request: () => ({}),
              },
            },
          ],
        },
      ],
    });
    expect(Array.isArray(store)).toBeTruthy();
    expect(typeof store[1] === 'function').toBeTruthy();

    expect(typeof store[0].hobbies.request === 'function').toBeTruthy();
    expect(typeof store[0].hobbies.cancel === 'function').toBeTruthy();
    expect(typeof store[0].friends.request === 'function').toBeTruthy();
    expect(typeof store[0].friends.cancel === 'function').toBeTruthy();

    expect(typeof store[0].addresses.home.request === 'function').toBeTruthy();
    expect(typeof store[0].addresses.home.cancel === 'function').toBeTruthy();
    expect(typeof store[0].addresses.company.request === 'function').toBeTruthy();
    expect(typeof store[0].addresses.company.cancel === 'function').toBeTruthy();
  });
});
