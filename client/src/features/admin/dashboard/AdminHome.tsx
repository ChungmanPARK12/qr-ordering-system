import Link from "next/link";

const AdminHome = () => {
  return (
    <div>
      <h1>Admin Home</h1>

      <ul>
        <li>
          <Link href="/admin/categories">Category Management</Link>
        </li>
        <li>
          <Link href="/admin/menus">Menu Management</Link>
        </li>
        <li>
          <Link href="/admin/options">Option Management</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminHome;
