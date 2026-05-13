import { env } from '../config/env.js';

type TicketAlertEvent = 'created' | 'closed';

type SendTicketWhatsAppAlertInput = {
  event: TicketAlertEvent;
  ticketId: string;
  companyName?: string;
  subject: string;
  occurredAt?: string | Date;
  status?: string;
  priority?: string;
  actorName?: string;
  actorRole?: string;
};

function formatEventDateTime(occurredAt?: string | Date) {
  const eventDate = occurredAt ? new Date(occurredAt) : new Date();
  const formatter = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata'
  });

  return formatter.format(eventDate);
}

function getWhatsAppConfig() {
  const { WHATSAPP_API_URL, WHATSAPP_ID_INSTANCE, WHATSAPP_API_TOKEN_INSTANCE, WHATSAPP_GROUP_ID } = env;

  if (!WHATSAPP_API_URL || !WHATSAPP_ID_INSTANCE || !WHATSAPP_API_TOKEN_INSTANCE || !WHATSAPP_GROUP_ID) {
    return null;
  }

  return {
    apiUrl: WHATSAPP_API_URL.replace(/\/$/, ''),
    idInstance: WHATSAPP_ID_INSTANCE,
    apiTokenInstance: WHATSAPP_API_TOKEN_INSTANCE,
    groupId: WHATSAPP_GROUP_ID
  };
}

function buildAlertMessage(input: SendTicketWhatsAppAlertInput) {
  const actorLine = input.actorName
    ? `By: ${input.actorName}${input.actorRole ? ` (${input.actorRole})` : ''}`
    : null;

  const lines = [
    input.event === 'created' ? 'New ticket created' : 'Ticket closed',
    `Ticket: ${input.ticketId}`,
    input.companyName ? `Company: ${input.companyName}` : null,
    `Subject: ${input.subject}`,
    `Date & Time: ${formatEventDateTime(input.occurredAt)}`,
    input.status ? `Status: ${input.status}` : null,
    input.priority ? `Priority: ${input.priority}` : null,
    actorLine
  ].filter((line): line is string => Boolean(line));

  return lines.join('\n');
}

export async function sendTicketWhatsAppAlert(input: SendTicketWhatsAppAlertInput) {
  const config = getWhatsAppConfig();
  if (!config) {
    return;
  }

  const response = await fetch(`${config.apiUrl}/waInstance${config.idInstance}/sendMessage/${config.apiTokenInstance}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatId: config.groupId,
      message: buildAlertMessage(input)
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`WhatsApp API request failed with status ${response.status}${errorText ? `: ${errorText}` : ''}`);
  }
}