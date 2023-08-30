import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';
import { ContactElement, getContact, updateContact } from '../contacts';

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<{ contact: ContactElement }> {
  if (!params.contactId)
    throw new Response('', {
      status: 404,
      statusText: 'Not Found',
    });
  const contact = await getContact(params.contactId);
  if (!contact)
    throw new Response('', {
      status: 404,
      statusText: 'Not Found',
    });
  return { contact };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData) as unknown as ContactElement;
  if (!params.contactId)
    throw new Response('', {
      status: 404,
      statusText: 'Not Found',
    });
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const { contact } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const navigate = useNavigate();
  return (
    <Form
      method='post'
      id='contact-form'
    >
      <p>
        <span>Name</span>
        <input
          placeholder='First'
          aria-label='First name'
          type='text'
          name='first'
          defaultValue={contact.first}
        />
        <input
          placeholder='Last'
          aria-label='Last name'
          type='text'
          name='last'
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type='text'
          name='twitter'
          placeholder='@jack'
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder='https://example.com/avatar.jpg'
          aria-label='Avatar URL'
          type='text'
          name='avatar'
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name='notes'
          defaultValue={contact.notes}
          rows={6}
        />
      </label>
      <p>
        <button type='submit'>Save</button>
        <button
          type='button'
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
