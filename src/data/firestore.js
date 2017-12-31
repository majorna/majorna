import { sleep } from './util';

export async function readFirestoreDocUntilExists(docRef) {
  let doc = await docRef.get();
  while (!doc.exists) {
    await sleep(2000);
    doc = await docRef.get();
  }
  return doc.data();
}