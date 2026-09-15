export class Node {
  value: any;
  next: Node | null = null;
  prev: Node | null = null;

  constructor(value: any) {
    this.value = value;
  }
}

export class SinglyLinkedList {
  head: Node | null = null;
  tail: Node | null = null;
  length = 0;

  append(value: any) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  removeFirst() {
    if (!this.head) return null;
    const removedNode = this.head;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.length--;
    return removedNode.value;
  }

  toArray() {
    const elements = [];
    let current = this.head;
    while (current) {
      elements.push(current.value);
      current = current.next;
    }
    return elements;
  }
}

export class DoublyLinkedList {
  head: Node | null = null;
  tail: Node | null = null;

  append(value: any) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
  }

  toArray() {
    const elements = [];
    let current = this.head;
    while (current) {
      elements.push(current.value);
      current = current.next;
    }
    return elements;
  }
}

export class CircularLinkedList {
  head: Node | null = null;
  tail: Node | null = null;

  append(value: any) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.tail.next = this.head;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
      this.tail.next = this.head;
    }
  }
}

export class CircularDoublyLinkedList {
  head: Node | null = null;
  tail: Node | null = null;

  append(value: any) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.head.next = this.head;
      this.head.prev = this.head;
    } else {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
      newNode.next = this.head;
      this.head!.prev = newNode;
      this.tail = newNode;
    }
  }

  toArray() {
    if (!this.head) return [];
    const elements = [];
    let current = this.head;
    do {
      elements.push(current.value);
      current = current.next!;
    } while (current !== this.head);
    return elements;
  }
}