// User Avatars
import avatar1 from '@/assets/user-avatar/img_v3_02nc_ffa3909b-0464-4842-905f-b9b2e3efae1g.jpg'
import avatar2 from '@/assets/user-avatar/img_v3_02nc_e71973b1-6cc7-47dc-8e47-34878194638g.jpg'
import avatar3 from '@/assets/user-avatar/img_v3_02nc_f4aae462-0112-4ba3-bbce-eaeb828172fg.jpg'
import avatar4 from '@/assets/user-avatar/img_v3_02nc_6d6b5fc9-2c8a-449d-82a2-034d844ca42g.jpg'
import avatar5 from '@/assets/user-avatar/img_v3_02nc_6ecbc9a9-1002-456e-88dd-3e11b86b0f8g.jpg'
import avatar6 from '@/assets/user-avatar/img_v3_02nc_e2adb59c-f4d1-49f5-a83c-4320f3a702fg.jpg'
import avatar7 from '@/assets/user-avatar/img_v3_02nc_5a15dcfd-c06b-4813-acf9-d7b617590cbg.jpg'
import avatar8 from '@/assets/user-avatar/img_v3_02nc_2d874b62-60fa-49b2-8811-c6702a64aa1g.jpg'
import avatarBtGr from '@/assets/user-avatar/bt_gr.jpg'

// Cover Images
import coverImage1 from '@/assets/cover-img/images.jpg'
import coverImage2 from '@/assets/cover-img/5da9acfd954f0aad37bb4624b61a86ee_800_550.jpg'
import coverLabubu from '@/assets/cover-img/labubu.jpg'
import coverLabubuRe from '@/assets/cover-img/labubu-re.webp'
import coverLabubuRed from '@/assets/cover-img/labubu-red.webp'
import coverPainting from '@/assets/cover-img/painting-7059647_1280.webp'



// Logo Images
import logo from '@/public/logo/logo.jpg'

export const images = {
  avatars: {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    btGr: avatarBtGr
  },
  covers: {
    default: coverImage1,
    image2: coverImage2,
    labubu: coverLabubu,
    labubuRe: coverLabubuRe,
    labubuRed: coverLabubuRed,
    painting: coverPainting
  },
  logo: {
    main: logo
  }
} as const

export type ImageAssets = typeof images 