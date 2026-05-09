import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import Final from './routes/Final';
import Listening from './routes/Listening';
import NoteView from './routes/NoteView';
import NotFound from './routes/NotFound';
import SolveStart from './routes/SolveStart';
import SongName from './routes/SongName';
import StaffPreview from './routes/StaffPreview';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<NoteView />} />
        <Route path="/solve" element={<SolveStart />} />
        <Route path="/listening" element={<Listening />} />
        <Route path="/song-name" element={<SongName />} />
        <Route path="/final" element={<Final />} />
        <Route path="/preview" element={<StaffPreview />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
