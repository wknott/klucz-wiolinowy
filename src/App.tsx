import StaffPreview from './routes/StaffPreview';

// NOTE: temporary — App.tsx currently renders StaffPreview as the only view so we
// can visually verify the <Staff /> component without a router. Real routing
// (and the actual game flow) lands in the next iteration; this whole file will
// be replaced then.
export default function App() {
  return <StaffPreview />;
}
