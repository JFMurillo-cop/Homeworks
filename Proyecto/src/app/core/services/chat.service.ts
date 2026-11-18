import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  writeBatch,
} from 'firebase/firestore';
import { AppUser, ChatMessage, ChatThread } from '../models';
import { firestore } from './firebase';

/**
 * Chat de soporte en tiempo real.
 * Estructura en Firestore:
 *   chats/{userId}                 → resumen de la conversación (para la bandeja del admin)
 *   chats/{userId}/messages/{id}   → mensajes
 */
@Injectable({ providedIn: 'root' })
export class ChatService {
  listenMessages(threadId: string, cb: (messages: ChatMessage[]) => void): Unsubscribe {
    const q = query(
      collection(firestore(), 'chats', threadId, 'messages'),
      orderBy('createdAt', 'asc'),
    );
    return onSnapshot(q, (snap) =>
      cb(snap.docs.map((d) => ({ ...(d.data() as ChatMessage), id: d.id }))),
    );
  }

  listenThreads(cb: (threads: ChatThread[]) => void): Unsubscribe {
    const q = query(collection(firestore(), 'chats'), orderBy('updatedAt', 'desc'));
    return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as ChatThread)));
  }

  /** Guarda el mensaje y actualiza el resumen del hilo en una sola escritura atómica. */
  async send(threadId: string, threadOwnerName: string, sender: AppUser, text: string): Promise<void> {
    const db = firestore();
    const now = Date.now();
    const batch = writeBatch(db);
    batch.set(doc(collection(db, 'chats', threadId, 'messages')), {
      senderId: sender.uid,
      senderName: sender.name,
      text,
      createdAt: now,
    });
    batch.set(
      doc(db, 'chats', threadId),
      { userId: threadId, userName: threadOwnerName, lastMessage: text, updatedAt: now },
      { merge: true },
    );
    await batch.commit();
  }
}
