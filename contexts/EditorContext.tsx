'use client'

import axios from 'axios'
import { createContext, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { createPost, updatePost } from '@/libs/actions'

interface EditorContextProps {
  mdValue: string
  setMdValue: React.Dispatch<React.SetStateAction<string>>
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  desc: string
  setDesc: React.Dispatch<React.SetStateAction<string>>
  thumbUrl: string
  setThumbUrl: React.Dispatch<React.SetStateAction<string>>
  handlePost: () => Promise<string | undefined>
  handleUpdatePost: ({ postId }: { postId: string }) => Promise<void>
  clearContent: () => void
}

export const EditorContext = createContext({} as EditorContextProps)

export default function EditorProvider({ children }: { children: React.ReactNode }) {
  const [mdValue, setMdValue] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [desc, setDesc] = useState<string>('')
  const [thumbUrl, setThumbUrl] = useState<string>('')

  const router = useRouter()

  const handlePost = async () => {
    try {
      if (!mdValue) return toast.error('Please enter content!')
      if (!title) return toast.error('Please enter title!')
      if (!desc) return toast.error('Please enter description!')
      if (!thumbUrl) return toast.error('Please upload thumbnail!')
      const newPost = await createPost({
        title,
        desc,
        rawContent: mdValue,
        thumbnail: thumbUrl,
      })
      router.push(`/post/${newPost.id}`)
      toast.success('Posted article!')
    } catch (error) {
      toast.error('Error posting article!')
    }
  }

  const handleUpdatePost = async ({ postId }: { postId: string }) => {
    try {
      await updatePost({ postId, title, desc, rawContent: mdValue, thumbnail: thumbUrl })
      router.push(`/post/${postId}`)
      toast.success('Updated article!')
    } catch (error) {
      toast.error('Error updating article!')
    }
  }

  const clearContent = () => {
    setMdValue('')
    setTitle('')
    setDesc('')
    setThumbUrl('')
  }

  return (
    <EditorContext.Provider
      value={{
        mdValue,
        setMdValue,
        title,
        setTitle,
        desc,
        setDesc,
        thumbUrl,
        setThumbUrl,
        handlePost,
        handleUpdatePost,
        clearContent,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
