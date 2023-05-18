import ListBook from "./components/ListBook";
import CreateBook from "./components/CreateBook";
import EditBook from "./components/EditBook";
import DeleteBook from "./components/DeleteBook";

const AppRoutes = [
  {
    index: true,
    element: <ListBook/>
  },
  {
    path: '/books/create',
    element: <CreateBook/>
  },
  {
    path: '/books/edit/:id',
    element: <EditBook/>
  },
  {
    path: '/books/delete/:id',
    element: <DeleteBook/>
  }
];

export default AppRoutes;
