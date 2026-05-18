import toast from 'react-hot-toast'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const SellerRequestsDataRow = ({ req, refetch }) => {
  const axiosSecure = useAxiosSecure()

  const handleRoleUpdate = async () => {
    try {
      await axiosSecure.patch('/update-role', {
        email: req?.email,
        role: 'seller',
      })
      toast.success('Role Updated!')
      refetch()
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message)
    }
  }
  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <p className='text-gray-900 dark:text-gray-100 '>{req?.email}</p>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm'>
        <span
          onClick={handleRoleUpdate}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 dark:text-green-200 leading-tight'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-green-200 dark:bg-green-800 dark:opacity-40 opacity-50 rounded-full'
          ></span>
          <span className='relative'>Make Seller</span>
        </span>
      </td>
    </tr>
  )
}

export default SellerRequestsDataRow
