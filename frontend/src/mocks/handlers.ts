import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/upload', async () => {
    return HttpResponse.json({ success: true, total_records: 1 });
  }),
];
