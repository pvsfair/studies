import {
  Form,
  LoaderFunctionArgs,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import { getContacts, createContact } from '../contacts';
import { ContactElement } from '../contacts';
import { useEffect } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q!);
  return { contacts, q };
}

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  const { contacts, q } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location && new URLSearchParams(navigation.location.search).has('q');

  useEffect(() => {
    const element = document.getElementById('q') as HTMLInputElement;
    element.value = q ?? '';
  }, [q]);

  return (
    <>
      <div id='sidebar'>
        <h1>React Router Contacts</h1>
        <div className=''>
          <Form
            id='search-form'
            role='search'
          >
            <input
              type='search'
              name='q'
              id='q'
              className={searching ? 'loading' : ''}
              aria-label='Search contacts'
              placeholder='Search'
              defaultValue={q ?? ''}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, { replace: !isFirstSearch });
              }}
            />
            <div
              id='search-spinner'
              aria-hidden
              hidden={!searching}
            ></div>
          </Form>
          <Form method='post'>
            <button type='submit'>New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact: ContactElement) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id='detail'
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet />
      </div>
    </>
  );
}
