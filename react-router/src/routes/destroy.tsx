import { ActionFunctionArgs, redirect } from 'react-router-dom';
import { deleteContact } from '../contacts';

export async function action({ params }: ActionFunctionArgs) {
  if (!params.contactId)
    throw new Response('', {
      status: 404,
      statusText: 'Not Found',
    });
  await deleteContact(params.contactId);
  return redirect('/');
}
