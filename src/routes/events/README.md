## `events.json`

```json
{
  "title": "",
  "date": ["", ""],
  "description": "",
  "website": "",
  "logo": ""
}
```

- `"title"` is the only required field
- `"date"` consists of start and end dates in the form `D MMM YYYY`
- `"logo"` should be a path to the `events` folder (under `static`)

Ideally, events should be sorted by date, if they exist.

## `sponsors.json`

```json
{
  "name": "",
  "logo": "",
  "tier": "",
  "paragraphs": [""],
  "links": [{ "text": "", "url": "" }]
}
```

- All fields are required
- `"logo"` should be a path to the `sponsors` folder (under `static`)
